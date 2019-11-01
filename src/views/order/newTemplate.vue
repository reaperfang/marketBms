<template>
  <div class="new-template">
    <section>
      <div class="title">基础信息设置</div>
      <div class="content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          :disabled="$route.query.mode == 'look'"
        >
          <el-form-item label="模板名称" prop="name">
            <el-input class="template-name" v-model="ruleForm.name" placeholder="请输入，不超过20个字符"></el-input>
          </el-form-item>
          <el-form-item label="计费方式" prop="calculationWay">
            <el-radio v-model="ruleForm.calculationWay" :label="1">按件计费</el-radio>
            <el-radio v-model="ruleForm.calculationWay" :label="2">按重计费</el-radio>
            <el-radio v-model="ruleForm.calculationWay" :label="3">按体积计费</el-radio>
          </el-form-item>
        </el-form>
      </div>
    </section>
    <section class="regional-setting">
      <div class="title">区域设置</div>
      <div class="content">
        <div class="content-item">
          <div class="content-item-title">
            <div class="row justify-between">
              <div class="col">
                <span>配送区域</span>
                <span class="des">说明：除指定区域外，其余区域按默认计算。</span>
              </div>
              <div
                v-if="$route.query.mode != 'look'"
                @click="currentDialog = 'RegionDialog'; dialogVisible = true"
                class="col blue pointer"
              >为指定区域设置运费</div>
            </div>
          </div>
          <div>
            <el-table
              :data="tableData"
              border
              :header-cell-style="{background:'#f3f4f3', color:'#132215'}"
              style="width: 100%"
            >
              <el-table-column prop="areaInfoList" label="配送到" width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.areaInfoList.map(val => val.cityName).join(',') || '默认运费（全国）'}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="one" width="180">
                <template slot-scope="scope">
                  <el-input :disabled="$route.query.mode == 'look'" type="number" min="0" v-model="scope.row.theFirst"></el-input>{{ruleForm.calculationWay | calculationWayFilter}}或以内
                </template>
              </el-table-column>
              <el-table-column label="运费（元）">
                <template slot-scope="scope">
                  <el-input :disabled="$route.query.mode == 'look'" type="number" min="0" v-model="scope.row.freight"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="two" width="180">
                <template slot-scope="scope">
                  每增加
                  <el-input :disabled="$route.query.mode == 'look'" type="number" min="0" v-model="scope.row.superaddition"></el-input>{{ruleForm.calculationWay | calculationWayFilter}}
                </template>
              </el-table-column>
              <el-table-column label="续费（元）" width="180">
                <template slot-scope="scope">
                  运费增加
                  <el-input :disabled="$route.query.mode == 'look'" type="number" min="0" v-model="scope.row.renew"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span @click="deleteRow(scope.$index)" v-if="scope.$index != 0 && $route.query.mode != 'look'" class="blue">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- <div class="content-item">
              <div class="content-item-title">
                <div class="row">
                  <div class="col">不配送区域</div>
                  <div class="col no-distribution-box">
                    <el-radio v-model="ruleForm.isNotSend" label="0">无</el-radio>
                    <el-radio v-model="ruleForm.isNotSend" label="1">有</el-radio>
                  </div>
                </div>
              </div>
              <div class="no-distribution-list">
                <div class="row">
                  <div class="col no-distribution-item" v-for="(item, index) in noDistributionList" :key="index">
                    <span>{{item}}</span>, <span @click="deleteItem(index)" class="delete-item">删除</span>
                  </div>
                </div>
              </div>
        </div>-->
      </div>
      <div v-if="$route.query.mode != 'look'" class="footer">
        <el-button @click="$router.go(-1)">取 消</el-button>
        <el-button @click="submit('ruleForm')" type="primary">确 定</el-button>
      </div>
    </section>
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="onSubmit"></component>
  </div>
</template>
<script>
import RegionDialog from "@/views/order/dialogs/regionDialog";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入模板名称'));
        } else if(/^\s*$/.test(value)) {
          callback(new Error('模板名称不能为空'));
        } else {
          if(value.length > 20) {
            callback(new Error('模板名称不超过20个字符'));
          }
          callback();
        }
      };
    return {
      ruleForm: {
        name: "",
        calculationWay: 1
      },
      noDistribution: "",
      noDistributionList: ["新建", "内蒙"],
      rules: {
          name: [
            { validator: validatePass, trigger: 'blur' },
          ],
          calculationWay: [
            { required: true, message: '请选择计费方式', trigger: 'blur' },
          ],
        },
      tableData: [],
      currentDialog: "",
      dialogVisible: false
    };
  },
  created() {
    if (this.$route.query.id) {
      this.getDetail();
    } else {
      this.tableData.push({
        "areaInfoList": [{
				"receivedProvinceCode": "",
				"receivedCityCode": "",
				"cityName": ""
			}],
			"theFirst": "",
			"freight": "",
			"superaddition": "",
			"renew": ""
      })
    }
  },
  filters: {
    calculationWayFilter(value) {
      if(value == 1) {
        return '件'
      } else if(value == 2) {
        return 'KG'
      } else if(value == 3) {
        return 'm³'
      }
    }
  },
  computed: {
    one() {
      if(this.ruleForm.calculationWay == 1) {
        return '首件'
      } else if(this.ruleForm.calculationWay == 2) {
        return '首重'
      } else if(this.ruleForm.calculationWay == 3) {
        return '首体积'
      }
    },
    two() {
      if(this.ruleForm.calculationWay == 1) {
        return '续件'
      } else if(this.ruleForm.calculationWay == 2) {
        return '续重'
      } else if(this.ruleForm.calculationWay == 3) {
        return '续体积'
      }
    },
  },
  methods: {
    deleteRow(index) {
      this.tableData.splice(index, 1)
    },
    editor() {
      let params = {};

      params = Object.assign({}, this.ruleForm, {
        templateContents: this.tableData
      });
      this._apis.order
        .editorFreightTemplate(params)
        .then(res => {
          this.$notify({
            title: "成功",
            message: "新建成功！",
            type: "success"
          });
          this.$router.push("/order/quickDelivery");
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error
          });
        });
    },
    add() {
      let params = {};

      params = Object.assign({}, this.ruleForm, {
        templateContents: this.tableData
      });
      this._apis.order
        .addFreightTemplate(params)
        .then(res => {
          this.$notify({
            title: "成功",
            message: "新建成功！",
            type: "success"
          });
          this.$router.push("/order/quickDelivery");
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error
          });
        });
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.tableData.some(val => !/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/.test(val.freight))) {
                this.$message({
                  message: '运费仅支持输入正数，允许小数点后两位',
                  type: 'warning'
                });
                return
              }
              if(this.tableData.some(val => !/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/.test(val.renew))) {
                this.$message({
                  message: '续费仅支持输入正数，允许小数点后两位',
                  type: 'warning'
                });
                return
              }
            if(this.ruleForm.calculationWay == 1) {
              if(this.tableData.some(val => !/^[1-9]\d*$/.test(val.theFirst))) {
                this.$message({
                  message: '首件仅支持正整数',
                  type: 'warning'
                });
                return
              }
              if(this.tableData.some(val => !/^[1-9]\d*$/.test(val.superaddition))) {
                this.$message({
                  message: '续件仅支持正整数',
                  type: 'warning'
                });
                return
              }
            } else if(this.ruleForm.calculationWay == 2) {
              if(this.tableData.some(val => !/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,3})?$/.test(val.theFirst))) {
                this.$message({
                  message: '首重仅支持输入正数，允许小数点后三位',
                  type: 'warning'
                });
                return
              }
              if(this.tableData.some(val => !/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,3})?$/.test(val.superaddition))) {
                this.$message({
                  message: '续重仅支持输入正数，允许小数点后三位',
                  type: 'warning'
                });
                return
              }
            } else if(this.ruleForm.calculationWay == 3) {
              if(this.tableData.some(val => !/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,3})?$/.test(val.theFirst))) {
                this.$message({
                  message: '首体积仅支持输入正数，允许小数点后三位',
                  type: 'warning'
                });
                return
              }
              if(this.tableData.some(val => !/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,3})?$/.test(val.superaddition))) {
                this.$message({
                  message: '续体积仅支持输入正数，允许小数点后三位',
                  type: 'warning'
                });
                return
              }
            }
            if(this.$route.query.id) {
              if(this.$route.query.mode == 'copy') {
                this.add()
              } else {
                this.editor()
              }
            } else {
              this.add()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    onSubmit(value) {
      console.log(value);
      this.tableData = [
        ...this.tableData,
        {
          areaInfoList: value.map(val => ({
            receivedProvinceCode: val.code,
            receivedCityCode: val.city.code,
            cityName: val.city.name
          })),
          theFirst: "",
          freight: "",
          superaddition: "",
          renew: ""
        }
      ];
    },
    dialogClose() {},
    selectedRegions() {},
    fetch() {},
    getArea() {
      return new Promise((resolve, reject) => {
        this._apis.order
          .getArea()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getDetail() {
      this.getArea().then(areaList => {
        this._apis.order
          .getTemplatePageDetail({ id: this.$route.query.id })
          .then(res => {
            this.ruleForm = Object.assign({}, this.ruleForm, res);
            let templateContents = JSON.parse(res.content);

            templateContents.forEach(templateContent => {
              let areaInfoList = templateContent.areaInfoList

              areaInfoList.forEach(areaInfo => {
                let receivedProvinceCode = areaInfo.receivedProvinceCode
                let receivedCityCode = areaInfo.receivedCityCode
                let cityName = ''

                if(receivedProvinceCode == '' && receivedCityCode == '') {
                  cityName = '默认运费（全国）'
                } else {
                  cityName = areaList.find(area => area.code == receivedProvinceCode).citys.find(city => city.code == receivedCityCode).name
                }

                areaInfo.cityName = cityName
              })
            })
            this.tableData = templateContents;
          })
          .catch(error => {
            this.visible = false;
            this.$notify.error({
              title: "错误",
              message: error
            });
          });
      });
    },
    deleteItem(index) {
      this.noDistributionList.splice(index, 1);
    }
  },
  components: {
    RegionDialog
  }
};
</script>
<style lang="scss" scoped>
.new-template {
  section {
    padding: 20px;
    background-color: #fff;
    .title {
      margin-bottom: 20px;
      font-size: 16px;
    }
    &.regional-setting {
      margin-top: 20px;
      .content {
        margin-left: 60px;
        .content-item {
          &:last-child {
            margin-top: 40px;
            .no-distribution-box {
              margin-left: 20px;
            }
            .no-distribution-list {
              border-radius: 4px;
              border: 1px solid rgba(202, 207, 203, 1);
              min-height: 180px;
              padding: 10px;
              .no-distribution-item {
                margin-right: 40px;
                .delete-item {
                  color: $globalMainColor;
                  cursor: pointer;
                }
              }
            }
          }
          .content-item-title {
            font-size: 16px;
            color: #161617;
            margin-bottom: 18px;
            .des {
              color: #9fa29f;
              font-size: 14px;
              margin-left: 20px;
            }
          }
        }
      }
      .footer {
        text-align: center;
        margin-top: 30px;
      }
      /deep/ .el-input {
        width: 62px;
        margin-right: 10px;
        margin-left: 10px;
      }
    }
  }
}
/deep/ .el-input {
  width: auto;
}
/deep/ label[for="name"]::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}
/deep/ .template-name {
  input {
    width: 350px;
  }
}
/deep/ .el-radio {
  margin-right: 30px;
}
</style>


