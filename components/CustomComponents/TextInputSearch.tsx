import { Grid, TextInput, IconSvg } from '@brick/core';
import React from 'react';

export const TextInputSearch = props => {
  const [inputValue, setInputValue] = React.useState('');
  const handleChange = value => {
    props.searchProps.onSearch(value);
    setInputValue(value);
  };
  return (
    <TextInput
      className="p-4"
      variant="inline"
      value={inputValue}
      placeholder={'Buscar...'}
      onChange={e => handleChange(e.target.value)}
      afterContent={
        <Grid className="m-4">
          <IconSvg type="search" size="xs" color="darkGrey" />
        </Grid>
      }
    />
  );
};
