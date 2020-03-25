import Vue from 'vue'

// let msfList = [
//     {
//         "seqnum": 1,
//         "navType": 1,
//         "eleValue": "",
//         "remark": "概况",
//         "btnArea": "",
//         "styleClass": "",
//         "platform": "134160222D87",
//         "parentId": "601",
//         "funcUrl": "",
//         "name": "商品",
//         "id": 694,
//         "styleKey": "",
//         "authorize": 0,
//         "children": [{
//             "seqnum": 1,
//             "navType": 2,
//             "eleValue": "",
//             "remark": "",
//             "btnArea": "",
//             "styleClass": "",
//             "platform": "134160222D87",
//             "parentId": "698",
//             "funcUrl": "/profile/upgrade",
//             "name": "商品列表",
//             "id": 699,
//             "styleKey": "",
//             "authorize": 0,
//             "children": [{
//                 "seqnum": 1,
//                 "navType": 3,
//                 "eleValue": "",
//                 "remark": "",
//                 "btnArea": "",
//                 "styleClass": "",
//                 "platform": "134160222D87",
//                 "parentId": "698",
//                 "funcUrl": "/profile/upgrade",
//                 "name": "默认页面",
//                 "id": 699,
//                 "styleKey": "",
//                 "authorize": 0,
//                 "children": [{
//                     "seqnum": 1,
//                     "navType": 4,
//                     "eleValue": "",
//                     "remark": "",
//                     "btnArea": "",
//                     "styleClass": "",
//                     "platform": "134160222D87",
//                     "parentId": "698",
//                     "funcUrl": "/profile/upgrade",
//                     "name": "编辑",
//                     "id": 699,
//                     "styleKey": "",
//                     "authorize": 0
//                 }, {
//                     "seqnum": 1,
//                     "navType": 4,
//                     "eleValue": "",
//                     "remark": "",
//                     "btnArea": "",
//                     "styleClass": "",
//                     "platform": "134160222D87",
//                     "parentId": "698",
//                     "funcUrl": "/profile/upgrade",
//                     "name": "删除",
//                     "id": 699,
//                     "styleKey": "",
//                     "authorize": 0
//                 }]
//             }]
//         }]
//     },
//     {
//         "seqnum": 1,
//         "navType": 1,
//         "eleValue": "",
//         "remark": "概况",
//         "btnArea": "",
//         "styleClass": "",
//         "platform": "134160222D87",
//         "parentId": "601",
//         "funcUrl": "",
//         "name": "订单",
//         "id": 694,
//         "styleKey": "",
//         "authorize": 0,
//         "children": [{
//             "seqnum": 1,
//             "navType": 2,
//             "eleValue": "",
//             "remark": "",
//             "btnArea": "",
//             "styleClass": "",
//             "platform": "134160222D87",
//             "parentId": "698",
//             "funcUrl": "/profile/upgrade",
//             "name": "订单查询",
//             "id": 699,
//             "styleKey": "",
//             "authorize": 0,
//             "children": [{
//                 "seqnum": 1,
//                 "navType": 3,
//                 "eleValue": "",
//                 "remark": "",
//                 "btnArea": "",
//                 "styleClass": "",
//                 "platform": "134160222D87",
//                 "parentId": "698",
//                 "funcUrl": "/profile/upgrade",
//                 "name": "商城订单",
//                 "id": 699,
//                 "styleKey": "",
//                 "authorize": 0,
//                 "children": [{
//                     "seqnum": 1,
//                     "navType": 4,
//                     "eleValue": "",
//                     "remark": "",
//                     "btnArea": "",
//                     "styleClass": "",
//                     "platform": "134160222D87",
//                     "parentId": "698",
//                     "funcUrl": "/profile/upgrade",
//                     "name": "查看详情",
//                     "id": 699,
//                     "styleKey": "",
//                     "authorize": 0
//                 }]
//             },{
//                 "seqnum": 1,
//                 "navType": 3,
//                 "eleValue": "",
//                 "remark": "",
//                 "btnArea": "",
//                 "styleClass": "",
//                 "platform": "134160222D87",
//                 "parentId": "698",
//                 "funcUrl": "/profile/upgrade",
//                 "name": "积分商城订单",
//                 "id": 699,
//                 "styleKey": "",
//                 "authorize": 0,
//                 "children": [{
//                     "seqnum": 1,
//                     "navType": 4,
//                     "eleValue": "",
//                     "remark": "",
//                     "btnArea": "",
//                     "styleClass": "",
//                     "platform": "134160222D87",
//                     "parentId": "698",
//                     "funcUrl": "/profile/upgrade",
//                     "name": "编辑",
//                     "id": 699,
//                     "styleKey": "",
//                     "authorize": 0
//                 }]
//             }]
//         }]
//     }
// ]
let msfList = []
let enable = 0

window.eventHub = new Vue()
var shopInfos = function() {
    if(localStorage.getItem('shopInfos')) {
        msfList = JSON.parse(localStorage.getItem('shopInfos')).data.functions[0].children

        Vue.directive('permission', {
            inserted: function (el, binding, vnode) {
                let { value } = binding

                if(typeof value == 'string') value = eval(value)
        
                let hasPermeission = function () {
                    let object1 = null
                    let object2 = null
                    let object3 = null
                    let object4 = null
        
                    object1 = msfList.find(val => val.name == value[0])
                    if(!object1) return false
                    if(object1.children) {
                        object2 = object1.children.find(val => val.name == value[1])
                        if(!object2) return false
                    }
                    if (value.length == 3) {
                        if (object2.children) {
                            object3 = object2.children.find(val => val.name == value[2])
                            if (object3) return true
                        }
                        return false
                    }
                    if (value.length == 4) {
                        if (object2.children) {
                            object3 = object2.children.find(val => val.name == value[2])
                            if (!object3) return false
                            if (object3.children) {
                                object4 = object3.children.find(val => val.name == value[3])
                                if (object4) return true
                            }
                        }
                        return false
                    }
                }
        
                if (value && value instanceof Array && (value.length > 2)) {
                    if (!hasPermeission()) {
                        if(el.className.indexOf('el-tab-pane') != -1) {
                            vnode.context.$nextTick(function () {
                                let _id = el.getAttribute('aria-labelledby')
        
                                let obj = document.getElementById(_id)
                                let parent = obj.parentNode
                                
                                el.parentNode.removeChild(el)
                                parent.removeChild(obj)
                                let firstNode = parent.getElementsByClassName('el-tabs__item')[0]
                                firstNode && firstNode.click()
                            })
                        } else {
                            el.parentNode && el.parentNode.removeChild(el)
                        }
                    }
                } else {
                    throw new Error('v-permission格式为长度大于2的字符串数组')
                }
            }
        })
    }
}
let anotherAuth = () => {
    if(localStorage.getItem('anotherAuthEnable')) {
        enable = +localStorage.getItem('anotherAuthEnable')

        Vue.directive('anotherauth', {
            inserted: (el, binding, vnode) => {
                if(binding.modifiers.disabled) {
                    if(enable == 1) {
                        if(binding.modifiers.button) {
                            let elm = el.getElementsByTagName('button')[0]
                            let className = el.className ? el.className + ' is-disabled' : 'is-disabled'

                            elm.setAttribute('disabled', 'disabled')
                            el.setAttribute('class', className)
                        } else if(binding.modifiers.cascader) {
                            let className = el.className ? el.className + ' is-disabled' : 'is-disabled'
                            let elInputClassName = el.querySelector('.el-input').className ? el.querySelector('.el-input').className + ' is-disabled' : 'is-disabled'

                            el.setAttribute('class', className)
                            el.querySelector('.el-input').setAttribute('class', elInputClassName)
                            el.querySelector('input').setAttribute('disabled', 'disabled')
                        }
                    }
                } else {
                    if(enable == 1) {
                        el.parentNode && el.parentNode.removeChild(el)
                    }
                }
            }
        })
    }
}

shopInfos()
anotherAuth()
window.eventHub.$on('onShopInfos', function() {
    shopInfos()
})
window.eventHub.$on('onGetShopAuthList', function() {
    anotherAuth()
})

Vue.directive('calcHeight', {
    inserted: function (el, binding, vnode) {
       el.style.height = document.body.clientHeight - (binding.value || 0) + 'px';
       vnode.context._globalEvent.$on('resize', ()=> {
           el.style.height = document.body.clientHeight - (binding.value || 0) + 'px';
       })
    },
    componentUpdated: function (el, binding, vnode) {
       el.style.height = document.body.clientHeight - (binding.value || 0) + 'px'
    }
})

