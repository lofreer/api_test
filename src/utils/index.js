/**
 * 转换状态值为属性值
 * @param key
 * @returns {function(*, *)}
 */
export function mapStateToProps(key) {
    return (state, ownProps) => {
        const { userInfo } = state['home']
        const result = Object.assign({}, ownProps.params)
        return state[key] ? Object.assign({}, state[key], result, {userInfo}) : Object.assign({}, result, {userInfo})
    }
}

export function setCookie(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}
  
export function getCookie(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }
    else {
        return null;
    }
}
  
export function removeCookie(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if(cval != null) {
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
}

/*
    用来存储有没有copy过的栈
*/  
function stackSet(key, value) {
    //o(n)
    let data = this.__data__
    let index = this.arryIndexOf(key)
    if ( index < 0 ) {
            //let data=[];//这个里面保存的是数组arry,数组的第一个是key,数组的第二个value
        data.push([key,value])
    }
    else{
        data[index][1]=value
    }
}
function arryIndexOf(key) {
    let data = this.__data__
    let length = data.length
    for (let i = 0; i < length; i++) {
        let entry = data[i]
        if (entry[0] == key)
            return i
    }
    return -1
}
function stackHas(key) {
    let data = this.__data__
    let length = data.length
    for (let i = 0; i < length; i++) {
        let entry = data[i]
        if (entry[0] == key)
        return i != -1
    }
    return false
}
function stackGet(key) {
    //o(n)
    let index = this.arryIndexOf(key)
    if ( index < 0 ) return
    return this.__data__ && this.__data__[index] && this.__data__[index][1]
}
function Stack() {
    let dataarry = []
    this.__data__ = dataarry //这个里面保存的是数组arry,数组的第一个是key,数组的第二个value
}
Stack.prototype.get = stackGet
Stack.prototype.set = stackSet
Stack.prototype.arryIndexOf = arryIndexOf


let toString = Object.prototype.toString
function isObject(object) {
    return object !=null && (typeof object == 'object')
}
function assignkeyvalue(object, key, value) {
    object[key] = value
}
function baseAssign(object, props) {
    let index = -1
    let length = props.length
    if (!object) {
        return
    }
    let dest = {}
    while (++index < length) {
        let key = props[index]
        assignkeyvalue(dest, key, object[key])
    }
    return dest
}
function getTag(object) {
    return toString.call(object)
}

/*
    拷贝对象
*/
function copyObject(object, stack) {
    if (!isObject(object)) {
        return
    }
    let tag = getTag(object)
    if(!!~['[object Number]', '[object Date]'].indexOf(tag)) {
        //Number Data  还有很多，这里是个示意
        let ctor = object.constructor
        return new ctor(+object)
    }
    let index = -1
    let keys = Object.keys(object)
    let length = keys.length
    let dest = {}
    //keys not include symbol
    while (++index < length) {
        let key = keys[index]
        if (isObject(object[key])) {
            stack = stack || new Stack
            //看对象有没有copy过
            let saved_value = stack.get(object)
            if (saved_value) {
                return saved_value
            }
            //设置为已拷贝
            stack.set(object, dest)
            //递归赋值
            assignkeyvalue(dest, key, copyObject(object[key], stack))
        }
        else{
            assignkeyvalue(dest, key, object[key])
        }
    }
    return dest
}
/*
    拷贝数组
*/
function copyArry(arry) {
    if (!Array.isArray(arry)) return []
    let dest = [],
        index = -1,
        length = arry.length
    while (++index < length) {
        if (isObject(arry[index])) {
            dest[index] = copyObject(arry[index])
        } else {
            dest[index] = arry[index]
        }
    }
    return dest
}
// 深拷贝
export function cloneDeep(object) {
    if (!isObject(object)) return object
    return Array.isArray(object) ? copyArry(object) : copyObject(object)
}