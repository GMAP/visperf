import _zip from 'lodash/zip';

export default function transposeArrays(arrays) {
    return _zip(...arrays);
}
