<template>
  <div class="wrappe">
    <el-form v-if="myState.formData" ref="elFormRef" :model="myState.formData" label-width="88px">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="配置方式" prop="configurationSelected">
            <el-radio-group v-model="myState.formData.configurationSelected">
              <el-radio v-for="item in myState.configurationArr" :label="item.value">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <span v-if="myState.formData.configurationSelected === 1">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="调度周期" prop="dispatchingCycle">
              <el-radio-group v-model="myState.formData.dispatchingCycle">
                <el-radio v-for="item in myState.dispatchingCycleArr" :label="item.value">{{ item.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="myState.formData.dispatchingCycle === 2" :gutter="24">
          <el-col :span="24">
            <el-form-item label="执行时间">
              <el-date-picker
                v-model="myState.formData.disposable.executionTime"
                type="datetime"
                @change="
                  () => {
                    myState.formData.cron = convertToCronExpression(myState.formData.disposable.executionTime)
                  }
                "
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择执行时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <span v-else>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label=" ">
                <el-select v-model="myState.selectedPattern">
                  <el-option
                    v-for="(val, index) in myState.pattern"
                    :key="val.sign"
                    :label="val.name"
                    :value="val.sign"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="myState.selectedPattern === 'minute'" :gutter="24">
            <el-col :span="24">
              <el-form-item label="生效时间">
                <el-date-picker
                  v-model="myState.formData.period[myState.selectedPattern].entryIntoForceTime"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  range-separator="~"
                  format="YYYY-MM-DD"
                  placeholder="选择生效时间"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
            </el-col>
            <el-col class="flex" :span="24">
              <el-form-item label="执行时间">
                <el-time-select
                  style="width: 100px"
                  start="00:00"
                  step="00:01"
                  end="23:59"
                  v-model="myState.formData.period[myState.selectedPattern].executionTimeObj.start"
                  placeholder="起始"
                />
                <div class="divider mr4 ml4"></div>
                <el-time-select
                  style="width: 100px"
                  class="mr4"
                  start="00:00"
                  step="01:00"
                  end="24:00"
                  v-model="myState.formData.period[myState.selectedPattern].executionTimeObj.end"
                  placeholder="结束"
                />
                <span class="flex">
                  间隔
                  <el-select
                    class="ml2 mr2"
                    style="width: 60px"
                    placeholder=""
                    v-model="myState.formData.period[myState.selectedPattern].executionTimeObj.stap"
                  >
                    <el-option v-for="(val, index) in 60" :key="val" :value="val"></el-option>
                  </el-select>
                  分钟
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="hour" v-if="myState.selectedPattern === 'hour'" :gutter="24">
            <el-col :span="24">
              <el-form-item label="生效时间">
                <el-date-picker
                  v-model="myState.formData.period[myState.selectedPattern].entryIntoForceTime"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  range-separator="~"
                  format="YYYY-MM-DD"
                  placeholder="选择生效时间"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
            </el-col>
            <el-radio-group v-model="myState.formData.period.hourMode">
              <el-col class="flex" :span="24">
                <el-radio label="执行时间"> {{ '' }}</el-radio>
                <el-form-item label="执行时间">
                  <el-time-select
                    :disabled="myState.formData.period.hourMode === '指定时间'"
                    style="width: 100px"
                    start="00:00"
                    step="00:01"
                    end="23:59"
                    v-model="myState.formData.period.hour.executionTimeObj.start"
                    placeholder="起始"
                  />
                  <div class="divider mr4 ml4"></div>
                  <el-time-select
                    :disabled="myState.formData.period.hourMode === '指定时间'"
                    style="width: 100px"
                    class="mr4"
                    start="00:00"
                    step="01:00"
                    end="24:00"
                    v-model="myState.formData.period.hour.executionTimeObj.end"
                    placeholder="结束"
                  />
                  <span class="flex">
                    间隔
                    <el-select
                      :disabled="myState.formData.period.hourMode === '指定时间'"
                      class="ml2 mr2"
                      style="width: 60px"
                      placeholder=""
                      v-model="myState.formData.period[myState.selectedPattern].executionTimeObj.stap"
                    >
                      <el-option v-for="(val, index) in 60" :key="val" :value="val" />
                    </el-select>
                    小时
                  </span>
                </el-form-item>
              </el-col>

              <el-col class="flex" :span="24">
                <el-radio label="指定时间">{{ '' }}</el-radio>
                <el-form-item label="指定时间">
                  <el-select
                    :disabled="myState.formData.period.hourMode === '执行时间'"
                    class="ml2 mr2"
                    multiple
                    placeholder=""
                    v-model="myState.formData.period[myState.selectedPattern].scheduleTime"
                  >
                    <el-option v-for="(val, index) in 23" :key="val" :value="val"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-radio-group>
          </el-row>
          <el-row class="day" v-if="myState.selectedPattern === 'day'" :gutter="24">
            <el-col :span="24">
              <el-form-item label="生效时间">
                <el-date-picker
                  v-model="myState.formData.period[myState.selectedPattern].entryIntoForceTime"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  range-separator="~"
                  format="YYYY-MM-DD"
                  placeholder="选择生效时间"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="执行时间">
                <el-time-select
                  class="mr4"
                  start="00:00"
                  step="00:01"
                  end="23:59"
                  v-model="myState.formData.period[myState.selectedPattern].executionTime"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="week" v-if="myState.selectedPattern === 'week'" :gutter="24">
            <el-col :span="24">
              <el-form-item label="生效时间">
                <el-date-picker
                  v-model="myState.formData.period[myState.selectedPattern].entryIntoForceTime"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  range-separator="~"
                  format="YYYY-MM-DD"
                  placeholder="选择生效时间"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="指定日期">
                <el-select multiple v-model="myState.formData.period[myState.selectedPattern].appointedDay">
                  <el-option
                    v-for="(val, index) in myState.formData.period.weekArr"
                    :key="val.value"
                    :label="val.lable"
                    value-key="value"
                    :value="val"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="执行时间">
                <el-time-select
                  class="mr4"
                  start="00:00"
                  step="00:01"
                  end="23:59"
                  v-model="myState.formData.period[myState.selectedPattern].executionTime"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="month" v-if="myState.selectedPattern === 'month'" :gutter="24">
            <el-col :span="24">
              <el-form-item label="生效时间">
                <el-date-picker
                  v-model="myState.formData.period[myState.selectedPattern].entryIntoForceTime"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  range-separator="~"
                  format="YYYY-MM-DD"
                  placeholder="选择生效时间"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="指定日期">
                <el-select multiple v-model="myState.formData.period[myState.selectedPattern].appointedMonth">
                  <el-option v-for="(val, index) in 31" :key="val" :label="`每月${val}号`" :value="val"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="执行时间">
                <el-time-select
                  class="mr4"
                  start="00:00"
                  step="00:01"
                  end="23:59"
                  v-model="myState.formData.period[myState.selectedPattern].executionTime"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="year" v-if="myState.selectedPattern === 'year'" :gutter="24">
            <el-col :span="24">
              <el-form-item label="生效时间">
                <el-date-picker
                  v-model="myState.formData.period[myState.selectedPattern].entryIntoForceTime"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  range-separator="~"
                  format="YYYY-MM-DD"
                  placeholder="选择生效时间"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="指定月份">
                <el-select multiple v-model="myState.formData.period[myState.selectedPattern].mounth">
                  <el-option v-for="(val, index) in 12" :key="val" :label="`${val}月`" :value="val"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="指定日期">
                <el-select multiple v-model="myState.formData.period[myState.selectedPattern].day">
                  <el-option v-for="(val, index) in 31" :key="val" :label="`每月${val}号`" :value="val"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="执行时间">
                <el-time-select
                  class="mr4"
                  start="00:00"
                  step="00:01"
                  end="23:59"
                  v-model="myState.formData.period[myState.selectedPattern].executionTime"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </span>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="调度计划"> {{ myState.formData.operationPlan }}</el-form-item>
          </el-col>
        </el-row>
      </span>
      <el-input v-else type="textarea" v-model="myState.formData.cron" placeholder="请输入"></el-input>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { dateFtt, isLeapYear, deepClone } from '@/core/js/$'
const emit = defineEmits(['getCron'])
const props = defineProps({
  propCronAnalyticInformation: {
    type: String,
    default: '',
  },
})
//下面是自己改的
const myState = reactive({
  pattern: [
    {
      name: '分',
      sign: 'minute',
    },
    {
      name: '时',
      sign: 'hour',
    },
    {
      name: '天',
      sign: 'day',
    },
    {
      name: '星期',
      sign: 'week',
    },
    {
      name: '月',
      sign: 'month',
    },
    {
      name: '年',
      sign: 'year',
    },
  ],
  selectedPattern: '',

  configurationArr: [
    {
      name: '常规',
      value: 1,
    },
    {
      name: 'crontab',
      value: 2,
    },
  ],
  dispatchingCycleArr: [
    {
      name: '周期',
      value: 1,
    },
    {
      name: '一次性',
      value: 2,
    },
  ],
  formData: {
    configurationSelected: 1,
    dispatchingCycle: 1,
    disposable: {
      executionTime: '',
    },
    period: {
      minute: {
        // entryIntoForceTime: [dateFtt('yyyy-MM-dd', new Date()), dateFtt('yyyy-MM-dd', new Date())],
        entryIntoForceTime: [],
        executionTimeObj: {
          start: '00:00',
          end: '23:59',
          stap: 1,
        },
      },
      hourMode: '执行时间',
      hourModeArr: ['执行时间', '指定时间'],
      hour: {
        // entryIntoForceTime: [dateFtt('yyyy-MM-dd', new Date()), dateFtt('yyyy-MM-dd', new Date())],
        entryIntoForceTime: [],
        executionTimeObj: {
          start: '00:00',
          end: '23:59',
          stap: 1,
        },
        scheduleTime: null,
      },
      day: {
        entryIntoForceTime: [],
        executionTime: '',
      },
      weekArr: [
        {
          lable: '星期一',
          value: 1,
        },
        {
          lable: '星期二',
          value: 2,
        },
        {
          lable: '星期三',
          value: 3,
        },
        {
          lable: '星期四',
          value: 4,
        },
        {
          lable: '星期五',
          value: 5,
        },
        {
          lable: '星期六',
          value: 6,
        },
        {
          lable: '星期日',
          value: 0,
        },
      ],
      week: {
        entryIntoForceTime: [],
        appointedDay: null,
        executionTime: '',
      },
      month: {
        entryIntoForceTime: [],
        appointedMonth: null,
        executionTime: '',
      },
      year: {
        entryIntoForceTime: [],
        mounth: '',
        day: '',
        executionTime: '',
      },
    },

    operationPlan: '',
    cron: '',
  },
})
if (props.propCronAnalyticInformation) {
  myState.formData = deepClone(JSON.parse(props.propCronAnalyticInformation))
}
const refresh = () => {
  myState.formData.operationPlan = ''
  myState.formData.cron = ''
}
watch(
  () => [myState.formData.configurationSelected, myState.formData.dispatchingCycle],
  (newVal) => {
    refresh()
  }
)

/**
 * 一次性构建cron表达式
 */
const convertToCronExpression = (dateTime) => {
  // 将日期时间字符串解析为Date对象
  const date = new Date(dateTime)

  // 获取年、月、日、小时、分钟和秒
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 月份从0开始，所以要加1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // 构建cron表达式
  const cronExpression = `${second} ${minute} ${hour} ${day} ${month} ? ${year}`
  myState.formData.operationPlan = `${year}年${month}月${day}日${hour}时${minute}分${second}秒执行`
  myState.formData.cron = cronExpression
  return cronExpression
}

const minuteToCronExpression = (startDate, endDate, startTime, endTime, interval) => {
  let every = [startDate, endDate, startTime, endTime, interval].every((item) => item)
  if (!every) {
    refresh()
    return
  }

  if (endTime == '00:00') {
    endTime = '24:00'
  }
  console.log(endTime, 'endTime', typeof endTime)
  const startDateIn = new Date(startDate)
  let startDateData = {
    year: startDateIn.getFullYear(),
    month: startDateIn.getMonth() + 1,
    day: startDateIn.getDate(),
  }
  const endDateIn = new Date(endDate)
  let endDateData = {
    year: endDateIn.getFullYear(),
    month: endDateIn.getMonth() + 1,
    day: endDateIn.getDate(),
  }
  const startTimeIn = new Date(`1971-01-01 ${startTime}:00`)
  let startTimeData = {
    hour: startTimeIn.getHours(),
    minute: startTimeIn.getMinutes(),
  }
  console.log('startTimeData', startTimeData)
  let endTimeData = {
    hour: endTime.split(':')[0],
    minute: endTime.split(':')[1],
  }
  myState.formData.operationPlan = `从${startDate} ${startTime}开始，中每间隔${interval}分钟执行一次。`
  let cronExpression
  console.log(startTimeData.hour)
  if (startTimeData.hour == '0' && endTimeData.hour == '24') {
    cronExpression = `0 ${startTimeData.minute}/${interval} * * * ? *`
  } else {
    cronExpression = `0 ${startTimeData.minute}/${interval} ${startTimeData.hour}-${endTimeData.hour} * * ? *`
  }
  myState.formData.cron = cronExpression
  return cronExpression
}
watch(
  () => myState.formData.period.minute,
  (newVal) => {
    console.log('newVal', newVal)
    if (myState.selectedPattern === 'minute') {
      minuteToCronExpression(
        newVal.entryIntoForceTime?.[0],
        newVal.entryIntoForceTime?.[1],
        newVal.executionTimeObj.start,
        newVal.executionTimeObj.end,
        newVal.executionTimeObj.stap
      )
      console.log('myState.formData.cron', myState.formData.cron)
    }
  },
  {
    deep: true,
    immediate: true,
  }
)
//小时调度
const hourToCronExpression = (startDate, endDate, startTime, endTime, interval) => {
  let every = [startDate, endDate, startTime, endTime, interval].every((item) => item)
  if (!every) {
    refresh()
    return
  }
  const startDateIn = new Date(startDate)
  let startDateData = {
    year: startDateIn.getFullYear(),
    month: startDateIn.getMonth() + 1,
    day: startDateIn.getDate(),
  }
  const endDateIn = new Date(endDate)
  let endDateData = {
    year: endDateIn.getFullYear(),
    month: endDateIn.getMonth() + 1,
    day: endDateIn.getDate(),
  }
  const startTimeIn = new Date(`1971-01-01 ${startTime}:00`)
  let startTimeData = {
    hour: startTimeIn.getHours(),
    minute: startTimeIn.getMinutes(),
  }
  console.log('startTimeData', startTimeData)
  const endTimeIn = new Date(`1971-01-01 ${endTime}:00`)
  let endTimeData = {
    hour: endTimeIn.getHours(),
    minute: endTimeIn.getMinutes(),
  }
  myState.formData.operationPlan = `从${startDate} ${startTime}开始，中每间隔${interval}小时执行一次。`
  const cronExpression = `0 ${startTimeData.minute} ${startTimeData.hour}/${interval} * * ? *`
  myState.formData.cron = cronExpression
  return cronExpression
}
//小时调度指定时间
const hourSTToCronExpression = (startDate, endDate, intervalArr) => {
  let every = [startDate, endDate, intervalArr].every((item) => item)
  if (!every) {
    refresh()
    return
  }
  const startDateIn = new Date(startDate)
  let startDateData = {
    year: startDateIn.getFullYear(),
    month: startDateIn.getMonth() + 1,
    day: startDateIn.getDate(),
  }
  const endDateIn = new Date(endDate)
  let endDateData = {
    year: endDateIn.getFullYear(),
    month: endDateIn.getMonth() + 1,
    day: endDateIn.getDate(),
  }

  myState.formData.operationPlan = `从${startDate}开始 每天的${intervalArr.join('、')}时分别执行一次。`
  const cronExpression = `0 0 ${intervalArr.join(',')} * * ? *`
  myState.formData.cron = cronExpression
  return cronExpression
}
watch(
  () => myState.formData.period.hour,
  (newVal) => {
    console.log('newVal', newVal)
    if (myState.selectedPattern === 'hour') {
      if (myState.formData.period.hourMode !== '指定时间') {
        hourToCronExpression(
          newVal.entryIntoForceTime?.[0],
          newVal.entryIntoForceTime?.[1],
          newVal.executionTimeObj.start,
          newVal.executionTimeObj.end,
          newVal.executionTimeObj.stap
        )
      } else {
        hourSTToCronExpression(newVal.entryIntoForceTime?.[0], newVal.entryIntoForceTime?.[1], newVal.scheduleTime)
      }

      console.log('myState.formData.cron', myState.formData.cron)
    }
  },
  {
    deep: true,
    immediate: true,
  }
)
//天调度
const dayToCronExpression = (startDate, endDate, intervalTime) => {
  let every = [startDate, endDate, intervalTime].every((item) => item)
  if (!every) {
    refresh()
    return
  }
  const startDateIn = new Date(startDate)
  let startDateData = {
    year: startDateIn.getFullYear(),
    month: startDateIn.getMonth() + 1,
    day: startDateIn.getDate(),
  }
  const endDateIn = new Date(endDate)
  let endDateData = {
    year: endDateIn.getFullYear(),
    month: endDateIn.getMonth() + 1,
    day: endDateIn.getDate(),
  }

  const intervalTimeIn = new Date(`1971-01-01 ${intervalTime}:00`)
  let intervalTimeData = {
    hour: intervalTimeIn.getHours(),
    minute: intervalTimeIn.getMinutes(),
  }

  myState.formData.operationPlan = `从${startDate} ${intervalTime}开始， 每隔一天执行一次。`
  const cronExpression = `0 ${intervalTimeData.minute} ${intervalTimeData.hour} ${startDateData.day}/1 * ? *`
  myState.formData.cron = cronExpression
  return cronExpression
}
watch(
  () => myState.formData.period.day,
  (newVal) => {
    console.log('newVal', newVal)
    if (myState.selectedPattern === 'day') {
      dayToCronExpression(newVal.entryIntoForceTime?.[0], newVal.entryIntoForceTime?.[1], newVal.executionTime)
      console.log('myState.formData.cron', myState.formData.cron)
    }
  },
  {
    deep: true,
    immediate: true,
  }
)
//周调度
const weekToCronExpression = (startDate, endDate, appointedDayArr, intervalTime) => {
  let every = [startDate, endDate, intervalTime].every((item) => item)
  if (!every) {
    refresh()
    return
  }
  const startDateIn = new Date(startDate)
  let startDateData = {
    year: startDateIn.getFullYear(),
    month: startDateIn.getMonth() + 1,
    day: startDateIn.getDate(),
  }
  const endDateIn = new Date(endDate)
  let endDateData = {
    year: endDateIn.getFullYear(),
    month: endDateIn.getMonth() + 1,
    day: endDateIn.getDate(),
  }
  const appointedDayValArr = appointedDayArr.map((item) => item.value)
  const intervalTimeIn = new Date(`1971-01-01 ${intervalTime}:00`)
  let intervalTimeData = {
    hour: intervalTimeIn.getHours(),
    minute: intervalTimeIn.getMinutes(),
  }

  myState.formData.operationPlan = `从${startDate}开始， 每周的${appointedDayArr
    .map((item) => item.lable)
    .join('、')} ${intervalTime}执行。`
  const cronExpression = `0 ${intervalTimeData.minute} ${intervalTimeData.hour} ? * ${appointedDayValArr.join(',')} *`
  myState.formData.cron = cronExpression
  return cronExpression
}
watch(
  () => myState.formData.period.week,
  (newVal) => {
    console.log('newVal', newVal)
    if (myState.selectedPattern === 'week') {
      weekToCronExpression(
        newVal.entryIntoForceTime?.[0],
        newVal.entryIntoForceTime?.[1],
        newVal.appointedDay,
        newVal.executionTime
      )
      console.log('myState.formData.cron', myState.formData.cron)
    }
  },
  {
    deep: true,
    immediate: true,
  }
)
//月调度
const monthToCronExpression = (startDate, endDate, appointedMonthArr, intervalTime) => {
  let every = [startDate, endDate, intervalTime].every((item) => item)
  if (!every) {
    refresh()
    return
  }
  const startDateIn = new Date(startDate)
  let startDateData = {
    year: startDateIn.getFullYear(),
    month: startDateIn.getMonth() + 1,
    day: startDateIn.getDate(),
  }
  const endDateIn = new Date(endDate)
  let endDateData = {
    year: endDateIn.getFullYear(),
    month: endDateIn.getMonth() + 1,
    day: endDateIn.getDate(),
  }
  const intervalTimeIn = new Date(`1971-01-01 ${intervalTime}:00`)
  let intervalTimeData = {
    hour: intervalTimeIn.getHours(),
    minute: intervalTimeIn.getMinutes(),
  }

  myState.formData.operationPlan = `从${startDateData.year}开始， 每月的${appointedMonthArr.join(
    '、'
  )}号 ${intervalTime}执行。`
  const cronExpression = `0 ${intervalTimeData.minute} ${intervalTimeData.hour} ${appointedMonthArr.join(',')} * ? *`
  myState.formData.cron = cronExpression
  return cronExpression
}
watch(
  () => myState.formData.period.month,
  (newVal) => {
    console.log('newVal', newVal)
    if (myState.selectedPattern === 'month') {
      monthToCronExpression(
        newVal.entryIntoForceTime?.[0],
        newVal.entryIntoForceTime?.[1],
        newVal.appointedMonth,
        newVal.executionTime
      )
      console.log('myState.formData.cron', myState.formData.cron)
    }
  },
  {
    deep: true,
    immediate: true,
  }
)
// 年调度
const yearToCronExpression = (startDate, endDate, mounth, day, intervalTime) => {
  let every = [startDate, endDate, intervalTime].every((item) => item)
  if (!every) {
    refresh()
    return
  }
  const startDateIn = new Date(startDate)
  let startDateData = {
    year: startDateIn.getFullYear(),
    month: startDateIn.getMonth() + 1,
    day: startDateIn.getDate(),
  }
  const endDateIn = new Date(endDate)
  let endDateData = {
    year: endDateIn.getFullYear(),
    month: endDateIn.getMonth() + 1,
    day: endDateIn.getDate(),
  }
  const intervalTimeIn = new Date(`1971-01-01 ${intervalTime}:00`)
  let intervalTimeData = {
    hour: intervalTimeIn.getHours(),
    minute: intervalTimeIn.getMinutes(),
  }

  myState.formData.operationPlan = `从${startDateData.year}开始， 每年的${mounth}月${day}日${executionTime}执行。`
  const cronExpression = `0 ${intervalTimeData.minute} ${intervalTimeData.hour} ${day} ${mounth} ? *`
  myState.formData.cron = cronExpression
  return cronExpression
}
watch(
  () => myState.formData.period.year,
  (newVal) => {
    console.log('newVal', newVal)
    if (myState.selectedPattern === 'year') {
      yearToCronExpression(
        newVal.entryIntoForceTime?.[0],
        newVal.entryIntoForceTime?.[1],
        newVal.mounth,
        newVal.day,
        newVal.executionTime
      )
      console.log('myState.formData.cron', myState.formData.cron)
    }
  },
  {
    deep: true,
    immediate: true,
  }
)
watch(
  () => myState.formData.cron,
  (newVal) => {
    emit('getCron', {
      cron: newVal,
      entryIntoForceTime: myState.formData.period[myState.selectedPattern]
        ? myState.formData.period[myState.selectedPattern].entryIntoForceTime
        : [null, null],
      cronAnalyticInformation: myState.formData,
    })
  }
)
</script>
<style scoped lang="scss">
.wrappe {
  width: 100%;
  .divider {
    border-top: 1px var(--el-border-color) var(--el-border-style);
    width: 20px;
    height: 1px;
  }
  .hour {
    :deep(.el-radio) {
      position: absolute;
    }
  }
}

:deep(.el-form-item__label) {
  font-weight: 400;
  // color: red;
}
:deep(.el-form-item) {
  margin-bottom: 18px;
}
</style>
