
import DialogMapSearch from '@/components/mapSearchDialog'
import dialogSelectImageMaterial from "@/views/shop/dialogs/dialogSelectImageMaterial";
const mixin = {
  data() {
    var validatePass = (rule, value, callback) => {
      let mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
      let tel = /^\d{3,4}-?\d{7,9}$/;
      if (!tel.test(value) && !mobile.test(value)) {
        return callback(new Error("请填写联系电话(座机格式'区号-座机号码')"));
      } else {
        callback();
      }
    };
    var emailValidatePass = (rule, value, callback) => {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

      if (!reg.test(value)) {
        return callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    return {
      provinceCityArea: '',
      boundary: '',
      // itemCatText: "",
      // itemCatList: [],
      // operateCategoryList: [],
      showShop: false,
      dialogVisible: false,
      currentDialog: "",
      isInit: true,
      tempSendAddress: null,
      form: {
        shopName: "",
        logo: "",
        logoCircle: "",
        phone: "",
        addressCode: "",
        address: null,
        shopIntroduce: null,
        business: null,
        itemCat: "",
        sellCategoryId: null,
        sellCategory: null,
        companyName: "",
        companyEmail: null,
        lat: "",
        lng: "",
        sendAddress: "",
        channel: []
      },
      rules: {
        shopName: [
          { required: true, message: "请输入商户名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        addressCode: [
          { required: true, message: "请填写联系地址", trigger: "blur" }
        ],
        // address: [
        //   { min: 1, max: 50,  message: "详细地址输入框超出50个字符后不可在输入", trigger: "blur" }
        // ],
        sendAddress: [
          { required: true, message: "联系地址不能为空，请输入后点击搜索地图，在地图上选择准确位置", trigger: "blur" }
        ],
        // shopIntroduce: [
        //   {
        //     min: 1,
        //     max: 100,
        //     message: "长度在 1 到 100 个字符",
        //     trigger: "blur"
        //   }
        // ],
        // business: [
        //   { required: true, message: "请选择主营类目", trigger: "change" }
        // ],
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        companyEmail: [
          { required: true, message: "请输入公司邮箱", trigger: "blur" },
          { validator: emailValidatePass, trigger: "blur" }
        ]
      },
      imageUrl: "",
      area: [],
      shopInfo: {},
      province: "",
      city: "",
      area: "",
      loading: false,
      uploadUrl: `${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      uploadUrlBase64: `${process.env.UPLOAD_SERVER}/web-file/file-server-base64/api_file_remote_upload.do`,
      mapStyle: {
        zoom: 4,
        zoomControl: true,
        panControl: true,
        scaleControl: true
      }, // 地图配置
      isMapChoose: false
      //canvas:{}
    };
  },
  components: { dialogSelectImageMaterial, DialogMapSearch },
  watch: {},
  computed: {
    mapLoaded() {
      return this.$store.getters.mapLoaded;
    },
    canvas() {
      return this.$refs.canvas1;
    },
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },
    getAddress() {
      return `${this.province}${this.city}${this.area}`
    }
  },
  created() {
    // Promise.all([this.getOperateCategoryList()]).then(() => {
    //   this.getShopInfo();
    // });
  },
  mounted() {
  },
  methods: {
    handleChangeAddress() {
      this.isMapChoose = false
    },
    imageSelected(item) {
      this.form.logo = item.filePath;
      this.handleAvatarSuccess(item.filePath);
    },
    handleChange(val) {
      this.province = this.$pcaa[86][this.form.addressCode[0]];
      this.city = this.$pcaa[this.form.addressCode[0]][
        this.form.addressCode[1]
      ];
      this.area = this.$pcaa[this.form.addressCode[1]][
        this.form.addressCode[2]
      ];
    },

    getShopInfo() {
      let id = this.cid;
      this._apis.set
        .getShopInfo({ id: id })
        .then(response => {
          this.form = Object.assign({}, this.form, response);
          if (response.provinceCode) {
            let arr = [];
            arr.push(response.provinceCode);
            arr.push(response.cityCode);
            arr.push(response.areaCode);
            this.form.addressCode = arr;
          }
          // 经纬度
          this.form.lat = response.latitude
          this.form.lng = response.longitude
          this.isMapChoose = true
        })
        .catch(error => {
          this.$message.error('查询失败');
        });
    },
    // 格式化省市县
    formatAddress(address, provinceCode, cityCode, areaCode) {
      const reg = /.+?(省|市|自治区|自治州|县|区)/g
      const province = this.$pcaa[86][provinceCode];
      const city = this.$pcaa[provinceCode][cityCode];
      const area = this.$pcaa[cityCode][areaCode];
      if (reg.test(address)) {
        address = address.replace(reg, '')
      }
      console.log('--formatAddress---',address)

      address = province === city ? `${province}${area}${address}`: `${province}${city}${area}${address}`
      
      return address
    },
    getReqData() {
      let id = this.cid
      let data = {
        id:id,
        shopName:this.form.shopName,
        logo:this.form.logo,
        logoCircle:this.form.logoCircle,
        phone:this.form.phone,
        province: this.province,
        city: this.city,
        area: this.area,
        provinceCode:this.form.addressCode[0],
        cityCode:this.form.addressCode[1],
        areaCode:this.form.addressCode[2],
        sendAddress: this.form.sendAddress,
        address: this.form.address,
        shopIntroduce:this.form.shopIntroduce,
        sellCategoryId: this.form.sellCategoryId,
        sellCategory: this.form.sellCategory,
        companyName: this.form.companyName,
        companyEmail: this.form.companyEmail,
        longitude: this.form.lng,
        latitude: this.form.lat,
        channel: this.form.channel.join(',')
      }
      return data
    },
    updateShopInfo() {
      // if (this.tempSendAddress !== this.form.sendAddress) {
      //   deliverServiceRadius = ''
      // }
      const data = this.getReqData()
      this._apis.set.updateShopInfo(data).then(response =>{
        this.setShopName()    
        this.$store.dispatch('getShopInfo');    
        // this.$nextTick(()=> {
        //   this.$refs.shopInfoMap.clearSearchResultList()
        //   this.$refs.shopInfoMap.clearKeyword()
        // })
      }).catch(error =>{
        console.log('updateShopInfo:error', error)
        this.$message.error('保存失败');
      }).finally(() => {
        this.loading = false
      })
    },
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.isMapChoose) {
            this.$message.error('保存失败')
            this.form.sendAddress = ''
            this.$refs.form.validateField('sendAddress')
            return false
          }
          this.loading = true
          this.updateShopInfo()
          
        }
      });
    },

    setShopName() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      let name = shopInfo.shopName;
      if (name != this.form.shopName) {
        shopInfo.shopName = this.form.shopName;
      }
      this.$store
        .dispatch("setShopInfos", shopInfo)
        .then(() => {
          this.$message.success("保存成功！");
          this.loading = false;
        })
        .catch(error => {});
    },

    handleAvatarSuccess(res) {
      //圆形图片处理
      var ctx = this.canvas.getContext("2d");
      let _self = this;
      var img = new Image();
      img.setAttribute("crossOrigin",'Anonymous')
      img.onload = function () {
          ctx.beginPath();
          // 绘制圆，参数（x坐标，y坐标，圆半径，起始角度，终止角度）
          ctx.arc(40, 40, 40, 0, 2*Math.PI);
          ctx.save();
          // 剪切形状
          ctx.clip();
          // 绘制头像，参数（图片资源，x坐标，y坐标，宽度，高度）
          ctx.drawImage(img, 0, 0, 80, 80);
          ctx.restore();
          ctx.closePath();
          let base64 = _self.canvas.toDataURL("image/png"); 
          let urlData = base64.substring(22, base64.length);          
          _self.uploadCircle(urlData)
      }
      img.src = res;
    },

    uploadCircle(urlData){
      axios.post(
        this.uploadUrlBase64,
        "json={\"cid\":\""+this.cid+"\", \"content\":\""+ encodeURI(urlData).replace(/\+/g,'%2B')+"\"}",
        {headers: {'Origin':location.protocol.split(':')[0]}}
      ).then((response) => {
        this.form.logoCircle = response.data.data.url
      }).catch((error) => {
        console.log(error);
      })
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpg";
      const isJPEG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!(isJPG || isJPEG || isPNG)  || !/\.jpg|\.jpeg|\.png|\.JPG|\.JPEG|\.PNG$/.test(file.name)) {
        this.$message.error("上传头像图片只能是JPG、JPEG、PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG || isJPEG || (isPNG && isLt2M);
    },
    getProvinceCode() {
      let provinces = this.$pcaa[86]
      let provinceCode = null
      for( const val in provinces) {
        console.log(val, this.province)
        if (provinces[val] === this.province) {
          console.log('--province---',val, provinces[val])
          provinceCode = val
          break
        }
      }
      return provinceCode
    },
    getCityCodeByProvinceCode(provinceCode) {
      const citys = this.$pcaa[provinceCode]
      let cityCode = null
      for( const val in citys) {
        if (citys[val] === this.city) {
          cityCode = val
          break
        }
      }
      return cityCode
    },
    getAreaCodeByCityCode(cityCode) {
      // this.area = this.$pcaa[this.form.addressCode[1]][
      //   this.form.addressCode[2]
      // ];
       const areas = this.$pcaa[cityCode]
      let areaCode = null
      for( const val in areas) {
        if (areas[val] === this.area) {
          areaCode = val
          break
        }
      }
      return areaCode
    },
    // getCity() {

    // },
    setCode() {
      const provinceCode =  this.getProvinceCode()
      const cityCode = this.getCityCodeByProvinceCode(provinceCode)
      const areaCode = this.getAreaCodeByCityCode(cityCode)
      // isInit 解决area-cascader 组件只有在初始化时 更新问题
      this.isInit = false
      let arr = [];
      arr.push(provinceCode);
      arr.push(cityCode);
      arr.push(areaCode);
      this.form.addressCode = arr;
      this.$nextTick(() => {
        this.isInit = true
      })
    },
    // 通过详细地址获取省市区
    getProvincesCities(address){
      const reg = /.+?(省|市|自治区|自治州|县|区)/g
      const arr = address.match(reg)
      console.log('---getProvincesCities---',arr)
      if (arr && arr.length > 0) {
        if (arr[0] !== '北京市' && arr[0] !== '上海市' && arr[0] !== '天津市' && arr[0] !== '重庆市') {
          this.province = arr[0]
          this.city = arr[1]
          this.area = arr[2]
        } else {
          this.province = arr[0]
          this.city = arr[0]
          this.area = arr[1]
        }
        this.setCode()
      }
    },
    getMapClickPoi(poi) {
      console.log('poi----getMapClickPoi', poi)
      if (!poi) return false 
      this.form.sendAddress = poi.address
      this.tempSendAddress = poi.address
      this.form.lat = poi.location.lat
      this.form.lng = poi.location.lng
      this.isMapChoose = true
      const arr = [poi.provinceCode, poi.cityCode, poi.areaCode]
      this.form.addressCode = arr;
      this.province = poi.provinceName
      this.city = poi.cityName
      this.area = poi.areaName
      this.$nextTick(() => {
        this.isInit = true
        this.$refs.form.validateField('sendAddress')
      })
    }
  }
  }

  export default mixin