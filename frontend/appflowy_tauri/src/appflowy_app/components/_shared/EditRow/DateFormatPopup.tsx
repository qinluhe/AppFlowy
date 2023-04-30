import { CellIdentifier } from '$app/stores/effects/database/cell/cell_bd_svc';
import { FieldController } from '$app/stores/effects/database/field/field_controller';
import { PopupWindow } from '$app/components/_shared/PopupWindow';
import { CheckmarkSvg } from '$app/components/_shared/svg/CheckmarkSvg';
import { useTranslation } from 'react-i18next';
import { DateFormat } from '@/services/backend';
import { useDateTimeFormat } from '$app/components/_shared/EditRow/DateTimeFormat.hooks';
import { useAppSelector } from '$app/stores/store';
import { useEffect, useState } from 'react';
import { IDateType } from '$app/stores/reducers/database/slice';

export const DateFormatPopup = ({
  left,
  top,
  cellIdentifier,
  fieldController,
  onOutsideClick,
}: {
  left: number;
  top: number;
  cellIdentifier: CellIdentifier;
  fieldController: FieldController;
  onOutsideClick: () => void;
}) => {
  const { t } = useTranslation('');
  const { changeDateFormat } = useDateTimeFormat(cellIdentifier, fieldController);
  const databaseStore = useAppSelector((state) => state.database);
  const [dateType, setDateType] = useState<IDateType | undefined>();

  useEffect(() => {
    setDateType(databaseStore.fields[cellIdentifier.fieldId]?.fieldOptions as IDateType);
  }, [databaseStore]);

  const changeFormat = async (format: DateFormat) => {
    await changeDateFormat(format);
    onOutsideClick();
  };

  return (
    <PopupWindow className={'p-2 text-xs'} onOutsideClick={onOutsideClick} left={left} top={top}>
      <PopupItem
        changeFormat={changeFormat}
        format={DateFormat.Friendly}
        checked={dateType?.dateFormat === DateFormat.Friendly}
        text={t('grid.field.dateFormatFriendly')}
      />
      <PopupItem
        changeFormat={changeFormat}
        format={DateFormat.ISO}
        checked={dateType?.dateFormat === DateFormat.ISO}
        text={t('grid.field.dateFormatISO')}
      />
      <PopupItem
        changeFormat={changeFormat}
        format={DateFormat.Local}
        checked={dateType?.dateFormat === DateFormat.Local}
        text={t('grid.field.dateFormatLocal')}
      />
      <PopupItem
        changeFormat={changeFormat}
        format={DateFormat.US}
        checked={dateType?.dateFormat === DateFormat.US}
        text={t('grid.field.dateFormatUS')}
      />
    </PopupWindow>
  );
};

function PopupItem({
  format,
  text,
  changeFormat,
  checked,
}: {
  format: DateFormat;
  text: string;
  changeFormat: (_: DateFormat) => Promise<void>;
  checked: boolean;
}) {
  return (
    <button
      onClick={() => changeFormat(format)}
      className={
        'flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 hover:bg-main-secondary'
      }
    >
      {text}

      {checked && (
        <div className={'ml-8 h-5 w-5 p-1'}>
          <CheckmarkSvg></CheckmarkSvg>
        </div>
      )}
    </button>
  );
}
