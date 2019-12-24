import { date_format, date_from_format } from './date_format';
import { ObjMapper } from './service';

export const date = {
  from_format: date_from_format,
  format:      date_format,
};

export {
  ObjMapper,
  ObjMapperSpec,
  ObjMapperArrayField,
  ObjMapperDateField,
  ObjMapperItemField,
} from './service';

export default ObjMapper;
