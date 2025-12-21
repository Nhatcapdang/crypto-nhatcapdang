import {
  AllCommunityModule,
  ModuleRegistry,
  iconSetQuartzBold,
  themeQuartz,
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const AgGridTheme = themeQuartz.withPart(iconSetQuartzBold).withParams({
  accentColor: 'var(--color-primary)',
  backgroundColor: 'var(--color-background)',
  borderRadius: 3,
  browserColorScheme: 'inherit',
  cellHorizontalPaddingScale: 1,
  checkboxCheckedBackgroundColor: 'var(--color-primary)',
  checkboxIndeterminateBackgroundColor: 'var(--color-primary)',
  checkboxUncheckedBackgroundColor: 'var(--color-secondary)',
  columnBorder: true,
  foregroundColor: 'var(--color-foreground)',
  headerFontFamily: 'inherit',
  headerFontSize: 14,
  headerFontWeight: 700,
  headerRowBorder: false,
  headerTextColor: 'var(--color-foreground)',
  headerVerticalPaddingScale: 1,
  iconSize: 14,
  rowBorder: true,
  rowVerticalPaddingScale: 1,
  wrapperBorder: false,
  wrapperBorderRadius: 8,
});

export default AgGridTheme;
