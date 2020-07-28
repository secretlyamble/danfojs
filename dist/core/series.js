"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Series = void 0;

var tf = _interopRequireWildcard(require("@tensorflow/tfjs-node"));

var _utils = require("./utils");

var _generic = _interopRequireDefault(require("./generic"));

var _table = require("table");

var _config = require("../config/config");

var _mathjs = require("mathjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const utils = new _utils.Utils();
const config = new _config.Configs();

class Series extends _generic.default {
  constructor(data, kwargs) {
    if (Array.isArray(data[0]) || utils.__is_object(data[0])) {
      data = utils.__convert_2D_to_1D(data);
      super(data, kwargs);
    } else {
      super(data, kwargs);
    }
  }

  get tensor() {
    return tf.tensor(this.values).asType(this.dtypes[0]);
  }

  head(rows = 5) {
    if (rows > this.values.length || rows < 1) {
      let config = {
        columns: this.column_names
      };
      return new Series(this.values, config);
    } else {
      let config = {
        columns: this.column_names
      };
      let data = this.values.slice(0, rows);
      return new Series(data, config);
    }
  }

  tail(rows = 5) {
    if (rows > this.values.length || rows < 1) {
      let config = {
        columns: this.column_names
      };
      return new Series(this.values, config);
    } else {
      let config = {
        columns: this.column_names
      };
      let data = this.values.slice(this.values.length - rows);
      let idx = this.index.slice(this.values.length - rows);
      let sf = new Series(data, config);

      sf.__set_index(idx);

      return sf;
    }
  }

  sample(num = 5) {
    if (num > this.values.length || num < 1) {
      let config = {
        columns: this.column_names
      };
      return new Series(this.values, config);
    } else {
      let values = this.values;
      let idx = this.index;
      let new_values = [];
      let new_idx = [];
      let counts = [...Array(idx.length).keys()];

      let rand_nums = utils.__randgen(num, 0, counts.length);

      rand_nums.map(i => {
        new_values.push(values[i]);
        new_idx.push(idx[i]);
      });
      let config = {
        columns: this.column_names,
        index: new_idx
      };
      let sf = new Series(new_values, config);
      return sf;
    }
  }

  add(other) {
    if (utils.__is_number(other)) {
      let sum = this.tensor.add(other).arraySync();
      return new Series(sum, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let sum = this.tensor.add(other.tensor).arraySync();
        return new Series(sum, {
          columns: this.column_names
        });
      }
    }
  }

  sub(other) {
    if (utils.__is_number(other)) {
      let sub = this.tensor.sub(other).arraySync();
      return new Series(sub, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let sub = this.tensor.sub(other.tensor).arraySync();
        return new Series(sub, {
          columns: this.column_names
        });
      }
    }
  }

  mul(other) {
    if (utils.__is_number(other)) {
      let mul = this.tensor.mul(other).arraySync();
      return new Series(mul, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let mul = this.tensor.mul(other.tensor).arraySync();
        return new Series(mul, {
          columns: this.column_names
        });
      }
    }
  }

  div(other, round = true) {
    if (utils.__is_number(other)) {
      let div_result = this.tensor.div(other);
      return new Series(div_result.arraySync(), {
        columns: this.column_names,
        dtypes: [div_result.dtype]
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let dtype;

        if (round) {
          dtype = "float32";
        } else {
          dtype = "int32";
        }

        let tensor1 = this.tensor.asType(dtype);
        let tensor2 = other.tensor.asType(dtype);
        let result = tensor1.div(tensor2);
        dtype = result.dtype;
        console.log(dtype);
        return new Series(result.arraySync(), {
          columns: this.column_names,
          dtypes: [dtype]
        });
      }
    }
  }

  pow(other) {
    if (utils.__is_number(other)) {
      let pow_result = this.tensor.pow(other).arraySync();
      return new Series(pow_result, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let pow_result = this.tensor.pow(other.tensor).arraySync();
        return new Series(pow_result, {
          columns: this.column_names
        });
      }
    }
  }

  mod(other) {
    if (utils.__is_number(other)) {
      let mod_result = this.tensor.mod(other).arraySync();
      return new Series(mod_result, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let mod_result = this.tensor.mod(other.tensor).arraySync();
        return new Series(mod_result, {
          columns: this.column_names
        });
      }
    }
  }

  mean() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support mean operation");
    }

    let mean = this.tensor.mean().arraySync();
    return mean;
  }

  median() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support median operation");
    }

    let values = this.values;

    let median = utils.__median(values, true);

    return median;
  }

  mode() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support mode operation");
    }

    let values = this.values;

    let mode = utils.__mode(values);

    return mode;
  }

  min() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support min operation");
    }

    let values = this.values;
    let min = tf.min(values).arraySync();
    return min;
  }

  max() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support max operation");
    }

    let values = this.values;
    let max = tf.max(values).arraySync();
    return max;
  }

  sum() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support sum operation");
    }

    let temp_sum = tf.tensor(this.values).asType(this.dtypes[0]).sum().arraySync();
    return temp_sum;
  }

  count() {
    if (!this.series) {
      throw Error("property error: Object must be a series");
    }

    return utils.__count_nan(this.values, true, true);
  }

  maximum(other) {
    if (utils.__is_number(other)) {
      let max_result = this.tensor.maximum(other);
      return new Series(max_result.arraySync(), {
        columns: this.column_names,
        dtypes: max_result.dtype
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let tensor1 = this.tensor;
        let tensor2 = other.tensor;
        let result = tensor1.maximum(tensor2);
        return new Series(result.arraySync(), {
          columns: this.column_names
        });
      }
    }
  }

  minimum(other) {
    if (utils.__is_number(other)) {
      let max_result = this.tensor.minimum(other);
      return new Series(max_result.arraySync(), {
        columns: this.column_names,
        dtypes: max_result.dtype
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let tensor1 = this.tensor;
        let tensor2 = other.tensor;
        let result = tensor1.minimum(tensor2).arraySync();
        return new Series(result, {
          columns: this.column_names
        });
      }
    }
  }

  round(dp) {
    if (utils.__is_undefined(dp)) {
      let result = tf.round(this.tensor);
      return new Series(result.arraySync(), {
        columns: this.column_names
      });
    } else {
      let result = utils.__round(this.values, dp, true);

      return new Series(result, {
        columns: this.column_names
      });
    }
  }

  std() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support std operation");
    }

    let values = this.values;
    let std_val = (0, _mathjs.std)(values);
    return std_val;
  }

  var() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support var operation");
    }

    let values = this.values;
    let var_val = (0, _mathjs.variance)(values);
    return var_val;
  }

  sort_values(kwargs = {}) {
    if (this.dtypes[0] == 'string') {
      throw Error("Dtype Error: cannot sort Series of type string");
    }

    let options = {};

    if (utils.__key_in_object(kwargs, 'ascending')) {
      options['ascending'] = kwargs["ascending"];
    } else {
      options['ascending'] = true;
    }

    if (utils.__key_in_object(kwargs, 'inplace')) {
      options['inplace'] = kwargs["inplace"];
    } else {
      options['inplace'] = false;
    }

    let sorted_arr = [];
    let sorted_idx = [];
    let arr_tensor = tf.clone(this.tensor);
    let arr_obj = [...this.values];

    for (let i = 0; i < this.shape[0]; i++) {
      let min_idx = arr_tensor.argMin().arraySync();
      sorted_arr.push(this.values[min_idx]);
      sorted_idx.push(this.index[min_idx]);
      arr_obj[min_idx] = NaN;
      arr_tensor = tf.tensor(arr_obj);
    }

    if (!options['ascending']) {
      sorted_arr = sorted_arr.reverse();
      sorted_idx = sorted_idx.reverse();
    }

    if (options['inplace']) {
      this.data = sorted_arr;

      this.__set_index(sorted_idx);

      return null;
    } else {
      let sf = new Series(sorted_arr, {
        columns: this.column_names
      });

      sf.__set_index(sorted_idx);

      return sf;
    }
  }

  copy() {
    let sf = new Series([...this.values], {
      columns: [...this.column_names]
    });

    sf.__set_index([...this.index]);

    sf.astype([...this.dtypes], false);
    return sf;
  }

  describe() {
    if (this.dtypes[0] == "string") {
      return null;
    } else {
      let index = ['count', 'mean', 'std', 'min', 'median', 'max', 'variance'];
      let count = this.count();
      let mean = this.mean();
      let std = this.std();
      let min = this.min();
      let median = this.median();
      let max = this.max();
      let variance = this.var();
      let vals = [count, mean, std, min, median, max, variance];
      let sf = new Series(vals, {
        columns: this.columns
      });

      sf.__set_index(index);

      return sf;
    }
  }

  reset_index(kwargs = {}) {
    let options = {};

    if (utils.__key_in_object(kwargs, 'inplace')) {
      options['inplace'] = kwargs['inplace'];
    } else {
      options['inplace'] = false;
    }

    if (options['inplace']) {
      this.__reset_index();
    } else {
      let sf = this.copy();

      sf.__reset_index();

      return sf;
    }
  }

  set_index(kwargs = {}) {
    let options = {};

    if (utils.__key_in_object(kwargs, 'index')) {
      options['index'] = kwargs['index'];
    } else {
      throw Error("Index ValueError: You must specify an array of index");
    }

    if (utils.__key_in_object(kwargs, 'inplace')) {
      options['inplace'] = kwargs['inplace'];
    } else {
      options['inplace'] = false;
    }

    if (options['index'].length != this.index.length) {
      throw Error(`Index LengthError: Lenght of new Index array ${options['index'].length} must match lenght of existing index ${this.index.length}`);
    }

    if (options['inplace']) {
      this.index_arr = options['index'];
    } else {
      let sf = this.copy();

      sf.__set_index(options['index']);

      return sf;
    }
  }

  __check_series_op_compactibility(other) {
    if (utils.__is_undefined(other.series)) {
      throw Error("param [other] must be a Series or a single value that can be broadcasted");
    }

    if (other.values.length != this.values.length) {
      throw Error("Shape Error: Series shape do not match");
    }

    if (this.dtypes[0] != 'float' || this.dtypes[0] != 'int') {
      throw Error(`dtype Error: Cannot perform operation on type ${this.dtypes[0]} with type ${other.dtypes[0]}`);
    }

    if (other.dtypes[0] != 'float' || other.dtypes[0] != 'int') {
      throw Error(`dtype Error: Cannot perform operation on type ${other.dtypes[0]} with type ${this.dtypes[0]}`);
    }

    return true;
  }

  map(callable) {
    let is_callable = utils.__is_function(callable);

    let data = this.data.map(val => {
      if (is_callable) {
        return callable(val);
      } else {
        if (utils.__is_object(callable)) {
          if (utils.__key_in_object(callable, val)) {
            return callable[val];
          } else {
            return "NaN";
          }
        } else {
          throw new Error("callable must either be a function or an object");
        }
      }
    });
    return data;
  }

  apply(callable) {
    let is_callable = utils.__is_function(callable);

    if (!is_callable) {
      throw new Error("the arguement most be a function");
    }

    let data = this.data.map(val => {
      return callable(val);
    });
    return data;
  }

  toString() {
    let table_width = 20;
    let table_truncate = 20;
    let max_row = config.get_max_row;
    let data_arr = [];
    let table_config = {};
    let header = [""].concat(this.columns);
    let idx, data;

    if (this.values.length > max_row) {
      data = this.values.slice(0, max_row);
      idx = this.index.slice(0, max_row);
    } else {
      data = this.values;
      idx = this.index;
    }

    idx.map((val, i) => {
      let row = [val].concat(data[i]);
      data_arr.push(row);
    });
    table_config[0] = 10;
    table_config[1] = {
      width: table_width,
      truncate: table_truncate
    };
    data_arr.unshift(header);
    return (0, _table.table)(data_arr, {
      columns: table_config
    });
  }

}

exports.Series = Series;