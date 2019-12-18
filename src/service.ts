import { ObjPath } from '@vparth/obj-path';
import { date_format, date_from_format } from './date_format';

const DEFAULT_DATE_FORMAT = 'Y-m-d';
export type ObjMapperDateField = {
  $type: 'date',
  fromFormat?: string,
  format?: string,
  key?: string,
};
export type ObjMapperArrayField = {
  $type: 'array';
  array?: 'string';
  key?: 'string';
  map?: ObjMapperSpec;
};
export type ObjMapperItemField = {
  $type?: 'item' | string,
  map?: ObjMapperSpec,
};
export type ObjMapperSpec = {
  [$key: string]: string | ObjMapperDateField | ObjMapperArrayField | ObjMapperItemField;
}

export class ObjMapper {
  constructor(private path: ObjPath) {
  }

  map($map: ObjMapperSpec, $source: any) {
    const $res = {};
    for (const [$key, $field] of Object.entries($map)) {
      let $value = null;
      if (typeof $field === 'object') {
        switch ($field.$type || 'item') {
          case 'date':
            $value = this.mapDate($field as ObjMapperDateField, $source);
            break;
          case 'array':
            $value = this.mapArray($field as ObjMapperArrayField, $source);
            break;
          case 'item':
          default:
            $value = this.map(('map' in $field ? $field.map : $field) as ObjMapperSpec, $source);
            break;
        }
      } else {
        $value = this.get($field, $source);
      }
      if ($key === '' && typeof $value === 'object') {
        for (const [k, v] of Object.entries($value)) {
          this.set(k, v, $res);
        }
      } else {
        this.set($key, $value, $res);
      }
    }
    return $res;
  }

  mapDate($field: ObjMapperDateField, $source: any) {
    const $format = $field.format || DEFAULT_DATE_FORMAT;
    let $value    = this.get($field.key || '', $source);

    if ($value.date) {
      $value = $value.date;
    }

    if (typeof $value === 'string') {
      $value = date_from_format($value, $field.fromFormat || 'Y-m-d');
    }

    return date_format($value, $format);
  }

  mapArray($map: ObjMapperArrayField, $source: any) {
    const $sourceArray = this.get($map.array || '', $source) || [];

    const $res = Array.isArray($sourceArray) ? [] : {};
    for (const [$i, $item] of Object.entries($sourceArray)) {
      let $value = null;
      if ($map.key) {
        $value = this.get($map.key, $item);
      } else if ($map.map) {
        $value = this.map($map.map, $item);
      } else {
        $value = $item;
      }

      this.set($i, $value, $res);
    }
    return $res;
  }

  get($key: string, $item: any) {
    return this.path.get($item, $key);
  }

  set($key: string, $value: any, $item: any): void {
    $key = $key.replace(/\$\$/g, '$');
    this.path.set($item, $key, $value);
  }
}
