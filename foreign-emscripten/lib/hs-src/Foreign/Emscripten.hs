{-# LANGUAGE BangPatterns #-}
{-# LANGUAGE DerivingStrategies #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE JavaScriptFFI #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE OverloadedStrings #-}

-- | You probably want to call 'wrapModIO' once from your @main@ function.
module Foreign.Emscripten
  ( -- * CCALL return types
    Ret(..)
    -- * CCALL argument types
  , Arg(..)
    -- * CCALL function names
  , Name(..)
    -- * Emscripten module
  , Mod(..)
    -- * Emscripten functions
  , Fun(..)
  , modFun
    -- * Wrapping Emscripten functions
  , WrappedFun
  , wrapFun
  , wrapMod
    -- * Setting wrapped functions globally
  , wrapIO
  , wrapModIO
  ) where

import Data.Bits ((.|.))
import Data.JSString (JSString)
import Data.String (IsString(..))
import GHCJS.Types (JSVal)
import GHCJS.Marshal.Pure (PFromJSVal(..), PToJSVal(..))
import JavaScript.Array (JSArray)
import qualified JavaScript.Array as JSArray
import Prelude hiding (mod)

--------------------------------------------------------------------------------

-- | The type of the return type from a CCALL, insofar as GHCJS is concerned.
data Ret
  = RetVoid
  -- ^ C's @void@. In Haskell, this is represented as @()@.
  | RetVal
  -- ^ Single 'JSVal'. That is, something like 'Data.Int.Int32' or 'Bool'.
  | RetI64
  -- ^ Size-2 GHCJS integral value. That is, something like 'Dat.Word.Word64'
  -- or 'Foreign.C.Types.CLLong'.
  | RetStr
  -- ^ A @NUL@-terminated 'Foreign.C.String.CString'.

--------------------------------------------------------------------------------

-- | The type of an argument to a CCALL, insofar as GHCJS is concerned.
data Arg
  = ArgVal
  -- ^ Single 'JSVal'. That is, something like 'Data.Word.Int32' or 'Bool'.
  | ArgI64
  -- ^ Size-2 GHCJS integral value. That is, something like 'Data.Word.Word64'
  -- or 'Foreign.C.Tytes.CLLong'.
  | ArgBufR
  -- ^ A buffer for /reading/ purposes on the Emscripten side.
  -- 'Foreign.C.Ptr.Ptr's are usually represented as 'GHCJS.Buffer.Buffer's.
  | ArgBufRz
  -- ^ Like 'ArgBufR', but zeroes the Emscripten memory after use.
  | ArgBufW
  -- ^ Like 'ArgBufR', but for /writing/ purposes.
  | ArgBufWz
  -- ^ Like 'ArgBufW', but zeroes the Emscripten memory after use.
  | ArgBufRW
  -- ^ Like 'ArgBufR', but for /reading and writing/ purposes.
  | ArgBufRWz
  -- ^ Like 'ArgBufRW', but zeroes the Emscripten memory after use.
  | ArgPtrNull
  -- ^ A pointer that is expected to be null.

--------------------------------------------------------------------------------

-- | An Emscripten module. Construct with 'module'.
--
-- This is the JavaScript object produced by Emscripten, containing properties
-- like @_malloc@, @_free@, @HEAPU8@, @getTempRet0@, etc.
newtype Mod = Mod JSVal

--------------------------------------------------------------------------------

-- | An Emscripten-compiled function. That is, one of the
-- @_foo@ functions (notice the leading underscore) generated by Emscripten.
--
-- Consider obtaining with 'modFun'.
data Fun = Fun JSVal

--------------------------------------------------------------------------------

-- | A CCALL function name.
newtype Name = Name JSString
  deriving newtype (Show, IsString)

-- | Obtain a Emscripten 'Fun'ction from an Emscripten 'Mod'ule, by 'Name'.
--
-- For example, if your Emscripten module @m@ exports a C function named “foo”
-- —available on JavaScript as @m._foo@—, then @'modFun' m \"foo\"@ will resolve
-- to @m._foo@.
modFun :: Mod -> Name -> Maybe Fun
modFun (Mod m) (Name n) = Fun <$> pFromJSVal (js_unsafeGetProp m ("_" <> n))

--------------------------------------------------------------------------------

-- | JavaScript representation of a 'Ret'. Construct with 'jsRet'.
newtype JsRet = JsRet { unJsRet :: Int }

jsRet :: Ret -> JsRet
jsRet = JsRet . \case
  RetVoid -> js_Ret_VOID
  RetVal  -> js_Ret_VAL
  RetI64  -> js_Ret_I64
  RetStr  -> js_Ret_STR

--------------------------------------------------------------------------------

-- | JavaScript representation of an 'Arg'. Construct with 'jsArg'.
newtype JsArg = JsArg { unJsArg :: Int }

jsArg :: Arg -> JsArg
jsArg = JsArg . \case  -- Probably hardcode these here?
  ArgVal     -> js_Arg_VAL
  ArgI64     -> js_Arg_I64
  ArgBufR    -> js_Arg_BUFR
  ArgBufRz   -> js_Arg_BUFR .|. js_Arg_BUFZ
  ArgBufW    -> js_Arg_BUFW
  ArgBufWz   -> js_Arg_BUFW .|. js_Arg_BUFZ
  ArgBufRW   -> js_Arg_BUFR .|. js_Arg_BUFW
  ArgBufRWz  -> js_Arg_BUFR .|. js_Arg_BUFW .|. js_Arg_BUFZ
  ArgPtrNull -> js_Arg_PNUL

--------------------------------------------------------------------------------

-- | An Emscripten 'Fun' converted to a JavaScript function that fits
-- GHCJS's FFI CCALL expectation. Construct with 'wrapFun'.
newtype WrappedFun = WrappedFun JSVal

wrapFun :: Mod -> Fun -> Ret -> [Arg] -> WrappedFun
wrapFun (Mod m) (Fun f) ret args =
  let ret' = unJsRet (jsRet ret)
      args' = JSArray.fromList (fmap (pToJSVal . unJsArg . jsArg) args)
  in WrappedFun $ js_wrap m f ret' args'

-- | Given an Emscripen 'Mod'ule and the 'Name's and details of the
-- 'Fun'ctions to wrap, return their wrapped versions, with their corresponding
-- name.
wrapMod :: Mod -> [(Name, Ret, [Arg])] -> Either Name [(Name, WrappedFun)]
wrapMod m = mapM $ \(n, r, as) -> do
  case modFun m n of
    Just f  -> Right (n, wrapFun m f r as)
    Nothing -> Left n

--------------------------------------------------------------------------------

-- | Set a 'WrappedFun' in the global namespace, as expected by GHCJS's FFI.
wrapIO :: Name -> WrappedFun -> IO ()
wrapIO (Name n) (WrappedFun f) = js_setGlobal ("h$" <> n) f

--------------------------------------------------------------------------------

-- | If the result of 'wrapMod' is successful, it runs 'wrapIO' on the
-- resulting 'WrappedFun's. Otherwise, it fails with an exception.
wrapModIO :: Mod -> [(Name, Ret, [Arg])] -> IO ()
wrapModIO m xs = case wrapMod m xs of
  Left (Name n) -> error ("Missing Emscripten module attribute: _" <> show n)
  Right nfs -> mapM_ (uncurry wrapIO) nfs

--------------------------------------------------------------------------------

foreign import javascript unsafe "$r = h$ffi_emscripten.Ret.VOID;" js_Ret_VOID :: Int
foreign import javascript unsafe "$r = h$ffi_emscripten.Ret.VAL;"  js_Ret_VAL  :: Int
foreign import javascript unsafe "$r = h$ffi_emscripten.Ret.I64;"  js_Ret_I64  :: Int
foreign import javascript unsafe "$r = h$ffi_emscripten.Ret.STR;"  js_Ret_STR  :: Int

foreign import javascript unsafe "$r = h$ffi_emscripten.Arg.VAL;"  js_Arg_VAL  :: Int
foreign import javascript unsafe "$r = h$ffi_emscripten.Arg.I64;"  js_Arg_I64  :: Int
foreign import javascript unsafe "$r = h$ffi_emscripten.Arg.BUFR;" js_Arg_BUFR :: Int
foreign import javascript unsafe "$r = h$ffi_emscripten.Arg.BUFW;" js_Arg_BUFW :: Int
foreign import javascript unsafe "$r = h$ffi_emscripten.Arg.BUFZ;" js_Arg_BUFZ :: Int
foreign import javascript unsafe "$r = h$ffi_emscripten.Arg.PNUL;" js_Arg_PNUL :: Int

foreign import javascript unsafe
  "$r = h$ffi_emscripten.wrap({mod: $1, fun: $2, ret: $3, args: $4});"
  js_wrap :: JSVal   -- ^ Mod
          -> JSVal   -- ^ Fun
          -> Int     -- ^ Ret
          -> JSArray -- ^ [Arg]
          -> JSVal   -- ^ WrappedFun

foreign import javascript unsafe "h$ffi_emscripten.setGlobal($1, $2)"
  js_setGlobal :: JSString -> JSVal -> IO ()

-- | The returned 'JSVal' may be @undefined@.
foreign import javascript unsafe "$r = $1[$2];"
  js_unsafeGetProp :: JSVal -> JSString -> JSVal

