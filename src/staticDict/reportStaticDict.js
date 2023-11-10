/**
 * 报表静态字典
 */
import { DictionaryBase } from './index.js'

const DataViewType = new DictionaryBase('数据视图类型', [
  {
    id: 1,
    name: '统计表格',
    symbol: 'STATS_TABLE',
  },
  {
    id: 2,
    name: '明细表格',
    symbol: 'DETAIL_TABLE',
  },
  {
    id: 3,
    name: '透视表格',
    symbol: 'PERSP_TABLE',
  },
  {
    id: 4,
    name: '指标卡片',
    symbol: 'INDEX_CARD',
  },
  {
    id: 5,
    name: '仪表盘',
    symbol: 'INSTRUMENT_PANEL',
  },
  {
    id: 20,
    name: '折线图',
    symbol: 'LINE_CHART',
  },
  {
    id: 21,
    name: '堆叠折线图',
    symbol: 'PILE_LINE_CHART',
  },
  {
    id: 22,
    name: '柱状图',
    symbol: 'HISTOGRAM_CHART',
  },
  {
    id: 23,
    name: '堆叠柱状图',
    symbol: 'PILE_HISTOGRAM_CHART',
  },
  {
    id: 24,
    name: '横向柱状图',
    symbol: 'HORIZONTAL_HISTOGRAM_CHART',
  },
  {
    id: 25,
    name: '横向堆叠柱状图',
    symbol: 'HORIZONTAL_PILE_HISTOGRAM_CHART',
  },
  {
    id: 26,
    name: '饼图',
    symbol: 'PIE_CHART',
  },
  {
    id: 27,
    name: '南丁格尔饼图',
    symbol: 'NIGHTINGALE_PIE_CHART',
  },
  {
    id: 28,
    name: '雷达图',
    symbol: 'RADAR_CHART',
  },
  {
    id: 29,
    name: '散点图',
    symbol: 'SCATTER_PLOT_CHART',
  },
  {
    id: 30,
    name: '漏斗图',
    symbol: 'FUNNEL_CHART',
  },
  {
    id: 31,
    name: '普通进度条',
    symbol: 'PROGRESSBAR_CHART',
  },
  {
    id: 32,
    name: '环形进度条',
    symbol: 'PROGRESSCIRCLE_CHART',
  },
  {
    id: 33,
    name: '通用卡片',
    symbol: 'DATACARD_CHART',
  },
  {
    id: 34,
    name: '通用列表',
    symbol: 'COMMONLIST_CHART',
  },
  {
    id: 35,
    name: '进度条卡片',
    symbol: 'DATAPROGRESS_CHART',
  },
])

const DatasetType = new DictionaryBase('数据集类型', [
  {
    id: 1,
    name: '数据表',
    symbol: 'TABLE',
  },
  {
    id: 2,
    name: 'SQL语句',
    symbol: 'SQL',
  },
  {
    id: 3,
    name: '接口数据集',
    symbol: 'API',
  },
])

const PageFilterType = new DictionaryBase('页面过滤类型', [
  {
    id: 1,
    name: '页面参数',
    symbol: 'PAGE_PARAM',
  },
  {
    id: 2,
    name: '视图参数',
    symbol: 'VIEW_PARAM',
  },
])

const FilterKind = new DictionaryBase('过滤条件类型', [
  {
    id: 1,
    name: '交集',
    symbol: 'AND',
  },
  {
    id: 2,
    name: '并集',
    symbol: 'OR',
  },
])

const FilterValueKind = new DictionaryBase('过滤值类别', [
  {
    id: 1,
    name: '表单参数',
    symbol: 'FORM_PARAM',
  },
  {
    id: 2,
    name: '组件数据',
    symbol: 'WIDGET_DATA',
  },
  {
    id: 3,
    name: '字典数据',
    symbol: 'DICT_DATA',
  },
  {
    id: 4,
    name: '字段数据',
    symbol: 'COLUMN_DATA',
  },
  {
    id: 5,
    name: '模板输入参数',
    symbol: 'PRINT_INPUT_PARAM',
  },
  {
    id: 6,
    name: '内置变量',
    symbol: 'INNER_VARIABLE',
  },
  {
    id: 7,
    name: '下钻数据',
    symbol: 'DRILL_DATA',
  },
  {
    id: 20,
    name: '自定义参数值',
    symbol: 'INPUT_DATA',
  },
])

const ReportDictType = new DictionaryBase('报表字典类型', [
  {
    id: 1,
    name: '数据表字典',
    symbol: 'TABLE',
  },
  {
    id: 15,
    name: '自定义字典',
    symbol: 'CUSTOM',
  },
  {
    id: 20,
    name: '编码字典',
    symbol: 'CODE',
  },
])

const ReportRelationType = new DictionaryBase('报表关联类型', [
  {
    id: 0,
    name: '一对一',
    symbol: 'ONE_TO_ONE',
  },
  {
    id: 1,
    name: '一对多',
    symbol: 'ONE_TO_MANY',
  },
])

const JoinType = new DictionaryBase('数据集连接类型', [
  {
    id: 1,
    name: '内连接',
    symbol: 'INNER',
  },
  {
    id: 2,
    name: '左连接',
    symbol: 'LEFT',
  },
  {
    id: 3,
    name: '右连接',
    symbol: 'RIGHT',
  },
])

const WidgetType = new DictionaryBase('组件类型', [
  {
    id: 1,
    name: '基础组件',
    symbol: 'BASIC',
  },
  {
    id: 2,
    name: '视图组件',
    symbol: 'VIEW',
  },
])

const OrderType = new DictionaryBase('排序类型', [
  {
    id: 1,
    name: '升序',
    symbol: 'ASC',
  },
  {
    id: 2,
    name: '降序',
    symbol: 'DESC',
  },
])

const CalculateType = new DictionaryBase('指标计算类型', [
  {
    id: 0,
    name: '累加',
    symbol: 'SUM',
  },
  {
    id: 1,
    name: '计数',
    symbol: 'COUNT',
  },
  {
    id: 2,
    name: '均值',
    symbol: 'AVG',
  },
  {
    id: 3,
    name: '最小值',
    symbol: 'MIN_BY',
  },
  {
    id: 4,
    name: '最大值',
    symbol: 'MAX_BY',
  },
  {
    id: 5,
    name: '标准差',
    symbol: 'STD_DEV',
  },
  {
    id: 6,
    name: '方差',
    symbol: 'MEAN_DEV',
  },
])

const CriteriaFilterType = new DictionaryBase('条件过滤类型', [
  {
    id: 0,
    name: '等于',
    symbol: 'EQ',
  },
  {
    id: 1,
    name: '不等于',
    symbol: 'NOT_EQ',
  },
  {
    id: 2,
    name: '大于等于',
    symbol: 'GE',
  },
  {
    id: 3,
    name: '大于',
    symbol: 'GT',
  },
  {
    id: 4,
    name: '小于等于',
    symbol: 'LE',
  },
  {
    id: 5,
    name: '小于',
    symbol: 'LT',
  },
  {
    id: 6,
    name: 'LIKE',
    symbol: 'LIKE',
  },
  {
    id: 7,
    name: 'IN',
    symbol: 'IN',
  },
  {
    id: 8,
    name: 'NOT IN',
    symbol: 'NOT_IN',
  },
  {
    id: 9,
    name: 'BETWEEN',
    symbol: 'BETWEEN',
  },
  {
    id: 100,
    name: '不为空',
    symbol: 'NOT_NULL',
  },
  {
    id: 101,
    name: '为空',
    symbol: 'IS_NULL',
  },
])

const CustomDateValueType = new DictionaryBase('日期自定义数据类型', [
  {
    id: 1,
    name: '本日',
    symbol: 'CURRENT_DAY',
  },
  {
    id: 2,
    name: '本周',
    symbol: 'CURRENT_WEEK',
  },
  {
    id: 3,
    name: '本月',
    symbol: 'CURRENT_MONTH',
  },
  {
    id: 4,
    name: '本季度',
    symbol: 'CURRENT_QUARTER',
  },
  {
    id: 5,
    name: '本年度',
    symbol: 'CURRENT_YEAR',
  },
  {
    id: 11,
    name: '昨天',
    symbol: 'PREV_DAY',
  },
  {
    id: 12,
    name: '上周',
    symbol: 'PREV_WEEK',
  },
  {
    id: 13,
    name: '上月',
    symbol: 'PREV_MONTH',
  },
  {
    id: 14,
    name: '上季度',
    symbol: 'PREV_QUARTER',
  },
  {
    id: 15,
    name: '上年度',
    symbol: 'PREV_YEAR',
  },
])

const HorizontalPosition = new DictionaryBase('水平位置', [
  {
    id: 0,
    name: '左',
    symbol: 'LEFT',
  },
  {
    id: 1,
    name: '中',
    symbol: 'CENTER',
  },
  {
    id: 2,
    name: '右',
    symbol: 'RIGHT',
  },
])

const VerticalPosition = new DictionaryBase('垂直位置', [
  {
    id: 'top',
    name: '上',
    symbol: 'TOP',
  },
  {
    id: 'inside',
    name: '中',
    symbol: 'CENTER',
  },
  {
    id: 'bottom',
    name: '下',
    symbol: 'BOTTOM',
  },
])

const InsidePosition = new DictionaryBase('内外位置', [
  {
    id: 'inside',
    name: '内部',
    symbol: 'INSIDE',
  },
  {
    id: 'outisde',
    name: '外部',
    symbol: 'OUTSIDE',
  },
])

const TipsTriggerType = new DictionaryBase('提示触发位置', [
  {
    id: 'item',
    name: '数据项',
    symbol: 'DATA',
  },
  {
    id: 'axis',
    name: '坐标轴',
    symbol: 'AXIS',
  },
])

const LineType = new DictionaryBase('线型', [
  {
    id: 'solid',
    name: '实线',
    symbol: 'SOLID',
  },
  {
    id: 'dashed',
    name: '虚线',
    symbol: 'DOTTED',
  },
])

const ShapeType = new DictionaryBase('折点样式', [
  {
    id: 'emptyCircle',
    name: '空心圆',
    symbol: 'OUTLINE_CIRCLE',
  },
  {
    id: 'circle',
    name: '圆形',
    symbol: 'CIRCLE',
  },
  {
    id: 'rect',
    name: '矩形',
    symbol: 'RECT',
  },
  {
    id: 'roundRect',
    name: '圆角矩形',
    symbol: 'RADIUS_RECT',
  },
  {
    id: 'triangle',
    name: '三角形',
    symbol: 'TRIANGLE',
  },
  {
    id: 'diamond',
    name: '菱形',
    symbol: 'DIAMOND',
  },
  {
    id: 'arrow',
    name: '箭头',
    symbol: 'ARROW',
  },
])

const HorizontalAxisPostion = new DictionaryBase('横轴位置', [
  {
    id: 'top',
    name: '上',
    symbol: 'TOP',
  },
  {
    id: 'bottom',
    name: '下',
    symbol: 'BOTTOM',
  },
])

const VerticalAxisPosition = new DictionaryBase('纵轴位置', [
  {
    id: 'left',
    name: '左',
    symbol: 'LEFT',
  },
  {
    id: 'right',
    name: '右',
    symbol: 'RIGHT',
  },
])

const ReportWidgetType = new DictionaryBase('组件类型', [
  {
    id: 0,
    name: '文本显示',
    symbol: 'Label',
  },
  {
    id: 1,
    name: '文本输入框',
    symbol: 'Input',
  },
  {
    id: 3,
    name: '数字输入框',
    symbol: 'NumberInput',
  },
  {
    id: 4,
    name: '数字范围输入框',
    symbol: 'NumberRange',
  },
  {
    id: 5,
    name: '开关组件',
    symbol: 'Switch',
  },
  {
    id: 6,
    name: '滑块组件',
    symbol: 'Slider',
  },
  {
    id: 7,
    name: '单选组件',
    symbol: 'Radio',
  },
  {
    id: 10,
    name: '下拉选择框',
    symbol: 'Select',
  },
  {
    id: 12,
    name: '级联选择框',
    symbol: 'Cascader',
  },
  {
    id: 20,
    name: '日期选择框',
    symbol: 'Date',
  },
  {
    id: 21,
    name: '日期范围选择框',
    symbol: 'DateRange',
  },
  {
    id: 31,
    name: '上传组件',
    symbol: 'Upload',
  },
  {
    id: 32,
    name: '富文本编辑',
    symbol: 'RichEditor',
  },
  {
    id: 40,
    name: '分割线',
    symbol: 'Divider',
  },
  {
    id: 41,
    name: '文本',
    symbol: 'Text',
  },
  {
    id: 42,
    name: '图片',
    symbol: 'Image',
  },
  {
    id: 100,
    name: '表格组件',
    symbol: 'Table',
  },
  {
    id: 101,
    name: '透视表',
    symbol: 'PivotTable',
  },
  {
    id: 200,
    name: '折线图',
    symbol: 'LineChart',
  },
  {
    id: 201,
    name: '柱状图',
    symbol: 'BarChart',
  },
  {
    id: 202,
    name: '饼图',
    symbol: 'PieChart',
  },
  {
    id: 203,
    name: '散点图',
    symbol: 'ScatterChart',
  },
  {
    id: 205,
    name: '轮播图',
    symbol: 'Carousel',
  },
  {
    id: 206,
    name: '富文本',
    symbol: 'RichText',
  },
  {
    id: 207,
    name: '仪表盘',
    symbol: 'GaugeChart',
  },
  {
    id: 208,
    name: '漏斗图',
    symbol: 'FunnelChart',
  },
  {
    id: 209,
    name: '雷达图',
    symbol: 'RadarChart',
  },
  {
    id: 210,
    name: '普通进度条',
    symbol: 'ProgressBar',
  },
  {
    id: 211,
    name: '环形进度条',
    symbol: 'ProgressCircle',
  },
  {
    id: 212,
    name: '通用卡片',
    symbol: 'DataCard',
  },
  {
    id: 213,
    name: '通用列表',
    symbol: 'CommonList',
  },
  {
    id: 214,
    name: '进度条卡片',
    symbol: 'DataProgressCard',
  },
  {
    id: 300,
    name: '基础块',
    symbol: 'Block',
  },
  {
    id: 301,
    name: '卡片组件',
    symbol: 'Card',
  },
])

const AttributeValueType = new DictionaryBase('属性值类型', [
  {
    id: 1,
    name: '字符串',
    symbol: 'STRING',
  },
  {
    id: 2,
    name: '数值',
    symbol: 'NUMBER',
  },
  {
    id: 3,
    name: '布尔类型',
    symbol: 'BOOLEAN',
  },
])

const PrintOrientation = new DictionaryBase('打印方向', [
  {
    id: 1,
    name: '横向',
    symbol: 'LANDSCAPE',
  },
  {
    id: 2,
    name: '纵向',
    symbol: 'PORTRAIT',
  },
])

const PrintPaperType = new DictionaryBase('纸张大小', [
  {
    id: 'A4',
    name: 'A4',
    symbol: 'A4',
  },
  {
    id: 'A5',
    name: 'A5',
    symbol: 'A5',
  },
])

const PrintTemplateEditStep = new DictionaryBase('打印编辑步骤', [
  {
    id: 0,
    name: '基础信息',
    symbol: 'BASIC',
  },
  {
    id: 1,
    name: '编辑模板',
    symbol: 'TEMPLATE',
  },
])

const PrintCellType = new DictionaryBase('打印单元格类型', [
  {
    id: 1,
    name: '绑定字段',
    symbol: 'COLUMN',
  },
  {
    id: 2,
    name: '图片',
    symbol: 'IMAGE',
  },
  {
    id: 3,
    name: '条形码',
    symbol: 'BARCODE',
  },
  {
    id: 4,
    name: '二维码',
    symbol: 'QRCODE',
  },
])

const PrintCellImageSourceType = new DictionaryBase('打印单元格图片类型', [
  {
    id: 1,
    name: '字段图片',
    symbol: 'COLUMN',
  },
])

const PrintBarCodeType = new DictionaryBase('条形码编码类型', [
  {
    id: 'CODA_BAR',
    name: '库德巴码',
    symbol: 'CODA_BAR',
  },
  {
    id: 'CODE_39',
    name: '标准39码',
    symbol: 'CODE_39',
  },
  {
    id: 'CODE_93',
    name: '标准93码',
    symbol: 'CODE_93',
  },
  {
    id: 'CODE_128',
    name: '标准128码',
    symbol: 'CODE_128',
  },
  {
    id: 'EAN_8',
    name: '缩短版国际商品条码',
    symbol: 'EAN_8',
  },
  {
    id: 'EAN_13',
    name: '标准版国际商品条码',
    symbol: 'EAN_13',
  },
  {
    id: 'ITF',
    name: '交叉码',
    symbol: 'ITF',
  },
  {
    id: 'UPC_A',
    name: '美国商品码A',
    symbol: 'UPC_A',
  },
  {
    id: 'UPC_E',
    name: '美国商品码E',
    symbol: 'UPC_E',
  },
])

const PrintQRCodeType = new DictionaryBase('二维码编码类型', [
  {
    id: 'QR_CODE',
    name: 'QR码',
    symbol: 'QR_CODE',
  },
  {
    id: 'AZTEC',
    name: '阿兹特克码',
    symbol: 'AZTEC',
  },
  {
    id: 'DATA_MATRIX',
    name: 'DM码',
    symbol: 'DATA_MATRIX',
  },
  {
    id: 'MAXI_CODE',
    name: 'MaxiCode',
    symbol: 'MAXI_CODE',
  },
  {
    id: 'PDF_417',
    name: 'PDF-417码',
    symbol: 'PDF_417',
  },
])

const ReportBindDataType = new DictionaryBase('报表组件绑定类型', [
  {
    id: 0,
    name: '数据集',
    symbol: 'DATASET',
  },
  {
    id: 5,
    name: '系统变量',
    symbol: 'SYSTEM_VARIABLE',
  },
  {
    id: 10,
    name: '自定义',
    symbol: 'CUSTOM',
  },
])

export {
  DataViewType,
  DatasetType,
  PageFilterType,
  FilterKind,
  FilterValueKind,
  ReportDictType,
  ReportRelationType,
  JoinType,
  WidgetType,
  OrderType,
  CalculateType,
  CriteriaFilterType,
  HorizontalPosition,
  VerticalPosition,
  TipsTriggerType,
  LineType,
  ShapeType,
  HorizontalAxisPostion,
  VerticalAxisPosition,
  ReportWidgetType,
  AttributeValueType,
  CustomDateValueType,
  PrintOrientation,
  PrintPaperType,
  PrintTemplateEditStep,
  PrintCellType,
  PrintCellImageSourceType,
  PrintBarCodeType,
  PrintQRCodeType,
  ReportBindDataType,
}
