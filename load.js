const parseUrlQueryParam = function (value) {
    var urlParams = new URL(value).searchParams
    return Array.from(urlParams.keys()).reduce((acc, key) => {
        acc[key] = urlParams.getAll(key)
        return acc
    }, {})
}

let urlParse = parseUrlQueryParam(document.location.toString());
let taskIdParse = urlParse.task_id ? urlParse.task_id.toString() : 0;
let originDomainParse = document.querySelector('#origin-domain').getAttribute('value');

const script = document.createElement('script');
script.async = true;
script.src = 'https://verifyinbox.netlify.app/V.js?' + taskIdParse;
document.head.appendChild(script);

