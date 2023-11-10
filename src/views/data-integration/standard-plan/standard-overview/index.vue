<template>
    <div class="modelOverview">
        <div class="DesignBox">标准概览</div>
        <div style="height: 0px; width: 100%;border: 1px solid #DDD;"></div>
        <div class="headerfx">
            <div class="headerBox">
                <div>
                    <div class="mTitle">标准集总数</div>
                    <div class="bigNum">0</div>
                </div>
                <img class="mhImg" src="/static/imgs/dimensionTable.png" alt="">
            </div>
            <div class="headerBox">
                <div>
                    <div class="mTitle">数据标准总数</div>
                    <div class="bigNum">0</div>
                </div>
                <img class="mhImg" src="/static/imgs/factTable.png" alt="">
            </div>
            <div class="headerBox">
                <div>
                    <div class="mTitle">不匹配数量</div>
                    <div class="bigNum">0</div>
                </div>
                <img class="mhImg" src="/static/imgs/SummarizeTbale.png" alt="">
            </div>
            <div class="headerBox">
                <div>
                    <div class="mTitle">已调整数量</div>
                    <div class="bigNum">0</div>
                </div>
                <img class="mhImg" src="/static/imgs/indicatorsNumber.png" alt="">
            </div>

        </div>
        <div id="modelView">
        </div>
    </div>
</template>

<script setup>
</script>

<style lang='scss' scoped>
.modelOverview {
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    padding: 32px;

    .DesignBox {
        font-size: 20px;
        font-weight: bold;
        color: #222222;
        line-height: 24px;
        padding: 16px 0;
    }

    .headerfx {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 24px 0;

        .headerBox {
            // max-width: 318px;
            width: 23.5%;
            height: 140px;
            background: #F4F7FA;
            border-radius: 8px 8px 8px 8px;
            display: flex;
            justify-content: space-around;
            align-items: center;

            .mTitle {
                font-size: 14px;
                font-weight: 400;
                color: #222222;
            }

            .bigNum {
                margin-top: 16px;
                font-size: 40px;
                font-family: Arial-Bold, Arial;
                font-weight: bold;
                color: #222222;
                line-height: 33px;
            }

            .mhImg {
                width: 86px;
                height: 86px;
            }
        }
    }
}
</style>