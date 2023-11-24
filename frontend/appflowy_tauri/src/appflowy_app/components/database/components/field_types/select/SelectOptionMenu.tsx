import { FC, useState } from 'react';
import { t } from 'i18next';
import { Divider, ListSubheader, Menu, MenuItem, MenuProps, OutlinedInput } from '@mui/material';
import { SelectOptionColorPB } from '@/services/backend';
import { ReactComponent as DeleteSvg } from '$app/assets/delete.svg';
import { ReactComponent as SelectCheckSvg } from '$app/assets/database/select-check.svg';
import { SelectOption } from '../../../application';
import { SelectOptionColorMap, SelectOptionColorTextMap } from './constants';
import Button from '@mui/material/Button';
import {
  deleteSelectOption,
  insertOrUpdateSelectOption,
} from '$app/components/database/application/field/select_option/select_option_service';
import { useViewId } from '$app/hooks';

interface SelectOptionMenuProps {
  fieldId: string;
  option: SelectOption;
  MenuProps: MenuProps;
}

const Colors = [
  SelectOptionColorPB.Purple,
  SelectOptionColorPB.Pink,
  SelectOptionColorPB.LightPink,
  SelectOptionColorPB.Orange,
  SelectOptionColorPB.Yellow,
  SelectOptionColorPB.Lime,
  SelectOptionColorPB.Green,
  SelectOptionColorPB.Aqua,
  SelectOptionColorPB.Blue,
];

export const SelectOptionMenu: FC<SelectOptionMenuProps> = ({ fieldId, option, MenuProps: menuProps }) => {
  const [tagName, setTagName] = useState(option.name);
  const viewId = useViewId();
  const updateOption = async ({ name, color }: { name?: string; color?: SelectOptionColorPB }) => {
    await insertOrUpdateSelectOption(viewId, fieldId, [
      {
        ...option,
        name: name ?? option.name,
        color: color ?? option.color,
      },
    ]);
  };

  const deleteOption = async () => {
    await deleteSelectOption(viewId, fieldId, [option]);
    menuProps.onClose?.({}, 'backdropClick');
  };

  const onClose = async () => {
    await updateOption({ name: tagName });
    menuProps.onClose?.({}, 'backdropClick');
  };

  return (
    <Menu
      keepMounted={false}
      classes={{
        paper: 'w-52',
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: -32,
      }}
      {...menuProps}
      onClose={onClose}
    >
      <ListSubheader className='my-2 leading-tight'>
        <OutlinedInput
          value={tagName}
          onChange={(e) => {
            setTagName(e.target.value);
          }}
          autoFocus={true}
          placeholder={t('grid.selectOption.tagName')}
          size='small'
        />
      </ListSubheader>
      <div className={'mb-2 px-3'}>
        <Button
          className={'flex w-full justify-start'}
          onClick={deleteOption}
          color={'inherit'}
          startIcon={<DeleteSvg />}
        >
          {t('grid.selectOption.deleteTag')}
        </Button>
      </div>

      <Divider />
      <MenuItem disabled>{t('grid.selectOption.colorPanelTitle')}</MenuItem>
      {Colors.map((color) => (
        <MenuItem
          onClick={() => {
            void updateOption({ color });
          }}
          key={color}
          value={color}
        >
          <span className={`mr-2 inline-flex h-4 w-4 rounded-full ${SelectOptionColorMap[color]}`} />
          <span className='flex-1'>{t(`grid.selectOption.${SelectOptionColorTextMap[color]}`)}</span>
          {option.color === color && <SelectCheckSvg />}
        </MenuItem>
      ))}
    </Menu>
  );
};