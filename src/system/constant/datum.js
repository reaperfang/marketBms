/* 客户模块常量 */
export default {
    //商品交易-商品总况
    goodsTotleData: [
        {   
            id: "001",
            url: require("@/assets/images/datum/c_01.png"),
            color: "#FE5E7A",
            text: "在售/上架商品数",
            num: 0
        },
        {
            id: "002",
            url: require("@/assets/images/datum/c_02.png"),
            color: "#AB47BC",
            text: "被访问商品数",
            num: 0
        },
        {
            id: "003",
            url: require("@/assets/images/datum/c_03.png"),
            color: "#13A5E2",
            text: "加购商品数",
            num: 0
        },
        {
            id: "004",
            url: require("@/assets/images/datum/c_04.png"),
            color: "#3D434A",
            text: "下单商品数",
            num: 0
        },
        {
            id: "005",
            url: require("@/assets/images/datum/c_05.png"),
            color: "#00D166",
            text: "维权商品数",
            num: 0
        },
        {
            id: "006",
            url: require("@/assets/images/datum/c_06.png"),
            color: "#FE506E",
            text: "售罄商品数",
            num: 0
        },
        {
            id: "007",
            url: require("@/assets/images/datum/c_07.png"),
            color: "#FFBF0E",
            text: "支付商品数",
            num: 0
        },
        {
            id: "008",
            url: require("@/assets/images/datum/c_08.png"),
            color: "#655EFF",
            text: "复购商品数",
            num: 0
        }
    ],
    //订单交易-交易总况（下单）
    placeOrderData: [
        {
            id: "01",
            text: "下单人数",
            num: 0,
            unit: "人"
        },
        {
            id: "02",
            text: "下单订单数",
            num: 0,
            unit: "单"
        },
        {
            id: "03",
            text: "下单（总）金额",
            num: 0,
            unit: "元"
        },
        {
            id: "04",
            text: "访问下单转化率",
            num: 0,
            unit: "%"
        }
    ],
    //订单交易-交易总况（未支付）
    nonPaymentData: [
        {
            id: "01",
            text: "未支付人数",
            num: 0,
            unit: "人"
        },
        {
            id: "02",
            text: "未支付订单数",
            num: 0,
            unit: "单"
        },
        {
            id: "03",
            text: "未支付订单总金额",
            num: 0,
            unit: "元"
        }
    ],
    //订单交易-交易总况（支付）
    paymentData: [
        {
            id: "01",
            text: "支付人数",
            num: 0,
            unit: "人"
        },
        {
            id: "02",
            text: "支付订单数",
            num: 0,
            unit: "单"
        },
        {
            id: "03",
            text: "订单支付（总）金额",
            num: 0,
            unit: "元"
        },
        {
            id: "04",
            text: "下单支付转化率",
            num: 0,
            unit: "%"
        }
    ],
    //订单交易-复购率及转化率
    orderProbabilityData: [
        {   
            id: "001",
            url: require("@/assets/images/datum/c_09.png"),
            color: "#FFBF0E",
            text: "店铺复购率",
            num: 0
        },
        {
            id: "002",
            url: require("@/assets/images/datum/c_10.png"),
            color: "#FF7777",
            text: "店铺支付转化率",
            num: 0
        }
    ]
}