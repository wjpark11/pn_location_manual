/*
 -------------------------------------------------------
 syntax 
 MAIN.createRelatedSelector(
    from   -> the filtering element           
    to     -> the element for filtered options
    obj    -> An object containing the options per
              option of the filtering (from) element
    [sort] -> optional sorting method for sorting
              of the complete or filtered options list
 --------------------------------------------------------
*/

//create the interdepent selectors
function initSelectors() {
    // next 2 statements should generate error message, see console
    MAIN.createRelatedSelector();
    MAIN.createRelatedSelector
        (document.querySelector('#areaselect1'));

    //countries
    MAIN.createRelatedSelector
        (document.querySelector('#areaselect1')           // from select element
            , document.querySelector('#areaselect2')      // to select element
            , area2
            , function (a, b) { return a > b ? 1 : a < b ? -1 : 0; }   // sort method
        );

}



//create MAIN namespace
(function (ns) { // don't pollute the global namespace

    function create(from, to, obj, srt) {
        if (!from) {
            throw CreationError('create: parameter selector [from] missing');
        }
        if (!to) {
            throw CreationError('create: parameter related selector [to] missing');
        }
        if (!obj) {
            throw CreationError('create: related filter definition object [obj] missing');
        }

        //retrieve all options from obj and add it
        obj.all = (function (o) {
            var a = [];
            for (var l in o) {
                a = /array/i.test(o[l].constructor) ? a.concat(o[l]) : a;
            }
            return a.sort(srt);
        }(obj));
        // initialize and populate to-selector with all
        populator.call(from
            , null
            , to
            , obj
            , srt
        );

        // assign handler    
        from.onchange = populator;

        function initStatics(fn, obj) {
            for (var l in obj) {
                if (obj.hasOwnProperty(l)) {
                    fn[l] = obj[l];
                }
            }
            fn.initialized = true;
        }

        function populator(e, relatedto, obj, srt) {
            // set pseudo statics
            var self = populator;
            if (!self.initialized) {
                initStatics(self, { optselects: obj, optselectsall: obj.all, relatedTo: relatedto, sorter: srt || false });
            }

            if (!self.relatedTo) {
                throw 'not related to a selector';
            }
            // populate to-selector from filter/all
            var optsfilter = this.selectedIndex < 1
                ? self.optselectsall
                : self.optselects[this.options[this.selectedIndex].firstChild.nodeValue]
                , cselect = self.relatedTo
                , opts = cselect.options;
            if (self.sorter) optsfilter.sort(self.sorter);
            opts.length = 0;
            for (var i = 0; i < optsfilter.length; i += 1) {
                opts[i] = new Option(optsfilter[i], i);
            }
        }
    }

    // custom Error
    function CreationError(mssg) {
        return { name: 'CreationError', message: mssg };
    }

    // return the create method with some error handling   
    window[ns] = {
        createRelatedSelector: function (from, to, obj, srt) {
            try {
                if (arguments.length < 1) {
                    throw CreationError('no parameters');
                }
                create.call(null, from, to, obj, srt);
            }
            catch (e) {
                console.log('createRelatedSelector ->', e.name, '\n'
                    + e.message +
                    '\ncheck parameters');
            }
        }
    };
}('MAIN'));
//initialize

initSelectors();

const selection1 = document.querySelector('#areaselect1');
const selection2 = document.querySelector('#areaselect2');
const selection3 = document.querySelector('#areaselect3');

function setAddress(e) {
    let selectedArea = selection1.options[selection1.selectedIndex].text + " " + selection2.options[selection2.selectedIndex].text;
    let html = '<ul class="list-group">'
    area3[selectedArea].forEach(area => html = html + '<li class="list-group-item">' + area + '</li>')
    html += '</ul>'
    selection3.innerHTML = html
}

document.querySelector('#areaselect2').addEventListener('change', setAddress)

