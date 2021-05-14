import { FormItemProps } from 'antd';
import obsceneFilter from './obsceneFilter';

type Rule = NonNullable<FormItemProps['rules']>[0]

export const formicObsceneValidator: Rule = {
  validator: (rule, value, callback) => {
    try {
      if (obsceneFilter.containsMat(value)) {
        throw new Error('Обсценная лексика!');
      }
      callback();
    } catch (err) {
      callback(err);
    }
  },
};
