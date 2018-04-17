var log = function() {
    console.log.apply(console, arguments)
}

var e = function(sel) {
    return document.querySelector(sel)
}
// es 返回一个数组, 包含所有被选中的元素
var es = function(sel) {
    return document.querySelectorAll(sel)
}

var bindAll = function(selector, eventName, callback) {
    var elements = document.querySelectorAll(selector)
    for(var i = 0; i < elements.length; i++) {
        var e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var removeClassAll = function(className) {
    var selector = '.' + className
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}

var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var bindEventButton = function() {
    var selector = '.tag'
    bindAll(selector, 'click', function(event) {
        log('button click')
        var parent = event.target.parentElement
        var sel = '.tag-content-' + event.target.dataset.index
        log(sel)
        var c = parent.querySelector(sel)
        removeClassAll('show')
        toggleClass(c, 'show')
    })
}
var __main = function () {
    bindEventButton()
}

__main()