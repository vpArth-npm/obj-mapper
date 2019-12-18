import { ObjPath } from '@vparth/obj-path';
import each from 'jest-each';
import { ObjMapper } from './service';

describe('ObjMapper', () => {
  let svc: ObjMapper;
  beforeEach(() => {
    svc = new ObjMapper(ObjPath.create('.', '\\'));
  });
  each([
    [{}, {}, {}],
    [{A: 'a'}, {a: 15}, {A: 15}],
    [{'a.b.c': 'd.e'}, {d: {e: {answer: 42}}}, {a: {b: {c: {answer: 42}}}}],
    [{'a.b.c': {'': 'd.e'}}, {d: {e: {answer: 42}}}, {a: {b: {c: {answer: 42}}}}],
    [{'a.b.c': {map: {'': 'd.e'}}}, {d: {e: {answer: 42}}}, {a: {b: {c: {answer: 42}}}}],
    [{'a.b.c': {'q': 'd.e'}}, {d: {e: {answer: 42}}}, {a: {b: {c: {q: {answer: 42}}}}}],
    [{A: 'a'}, {}, {A: null}],
    [{A: {$type: 'array'}}, [], {A: []}],
    [{A: {$type: 'array'}}, null, {A: []}],
    [{A: {$type: 'array', array: ''}}, [7, 8], {A: [7, 8]}],
    [{A: {$type: 'array', array: 'x'}}, {x: [7, 8]}, {A: [7, 8]}],
    [{A: {$type: 'date'}}, new Date('2019-03-17'), {A: '2019-03-17'}],
    [{A: {$type: 'date', format: 'd.m.Y'}}, new Date('2019-03-17'), {A: '17.03.2019'}],
    [{A: {$type: 'date', fromFormat: 'd.m.Y'}}, '17.03.2019', {A: '2019-03-17'}],
    [{A: {$type: 'date', format: 'd.m.Y'}}, {date: '2019-03-17'}, {A: '17.03.2019'}],
    [{A: {$type: 'date', format: 'd.m.Y', fromFormat: 'Y-m-d'}}, {date: '2019-03-17'}, {A: '17.03.2019'}],
    // Escaping
    [{A: {type: 'array'}}, {array: 7}, {A: {type: 7}}],
    [{A: {$$type: 'array'}}, {array: 7}, {A: {$type: 7}}],
    [{A: {$$$type: 'array'}}, {array: 7}, {A: {$$type: 7}}],


    [
      {A: {$type: 'array', array: 'item', key: 'x'}},
      {item: [{x: 1}, {x: 2}]},
      {A: [1, 2]},
    ],
    [
      {A: {$type: 'array', array: 'item', key: 'x'}},
      {item: {one: {x: 1}, two: {x: 2}}},
      {A: {one: 1, two: 2}},
    ],
    [
      {A: {$type: 'array', array: 'item', key: 'x'}},
      {item: [{x: 1}, {x: 2}]},
      {A: [1, 2]},
    ],
    [
      {A: {$type: 'array', array: 'item', 'map': {X: 'x'}}},
      {item: [{x: 1}, {x: 2}]},
      {A: [{X: 1}, {X: 2}]},
    ],
    [
      {
        ids:    {$type: 'array', key: 'id'},
        titles: {$type: 'array', key: 'title'},
      },
      [
        {id: 1, title: 'One'},
        {id: 2, title: 'Two'},
      ],
      {
        ids:    [1, 2],
        titles: ['One', 'Two'],
      },
    ],
    [
      {'root.el': {a: 'x', b: 'y', l: {$type: 'array', array: 'z.items', key: 'id'}}},
      {x: 1, y: 2, z: {items: [{id: 1}, {id: 2}]}},
      {root: {el: {a: 1, b: 2, l: [1, 2]}}},
    ],
  ]).it('%j of %j', (map, source, expected) => {
    const actual = svc.map(map, source);

    expect(actual).toEqual(expected);
  });
});
