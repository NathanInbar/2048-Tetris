export var TileShiftResult;
(function (TileShiftResult) {
    TileShiftResult[TileShiftResult["FAIL_OUTOFBOUNDS"] = 0] = "FAIL_OUTOFBOUNDS";
    TileShiftResult[TileShiftResult["FAIL_OCCUPIED"] = 1] = "FAIL_OCCUPIED";
    TileShiftResult[TileShiftResult["SUCCESS_SHIFTED"] = 2] = "SUCCESS_SHIFTED";
    TileShiftResult[TileShiftResult["SUCCESS_MERGED"] = 3] = "SUCCESS_MERGED";
})(TileShiftResult || (TileShiftResult = {}));
