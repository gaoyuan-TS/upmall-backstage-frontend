export default {
   // sku排列算法
   cartesianProductOf() {
       return Array.prototype.reduce.call(arguments,function(a,b) {
           var ret = []
           a.forEach(function(a) {
               b.forEach(function(b) {
                   ret.push(a.concat([b]))
               })
           })
           return ret
       },[[]])
   },

   throttleFunc(func, marginTime) {
        if (marginTime == undefined || marginTime == null) {
            marginTime = 1700
        }
        let lastTime = null
        return function () {
            let currentTime = + new Date()
            if (currentTime - lastTime > marginTime || !lastTime) {
                func.apply(this, arguments)
                lastTime = currentTime
            }
        }
    }
}