function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatPrice(price){
  if(!price){
    return price;
  } else if (isNaN(price)){
    return price;
  } else {
    price = price.toFixed(2);
    return price;
  }
}

module.exports = {
  formatTime: formatTime,
  formatPrice: formatPrice,
  formatNumber: formatNumber
}
