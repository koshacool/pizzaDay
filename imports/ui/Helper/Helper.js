export const Helper = {
    countEvailableItems (object) {
        let counter = 0;
        for (let key in object) {
            if (object[key]) {
                counter++;
            }
        }
        return counter;
    },

    handleInputChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    },

    nonEmptyInput (value)  {
        return value.length > 0;
    },

    hideModalWindow() {
        document.body.removeChild(document.getElementById('modalDiv'));
    },

    createElementDom(name, attributes = null, children = null) {
        //Concatination object params for style atributes
        function concatStyle(obj) {
            var params = '';
            for (var key in obj) {
                params += key + ': ' + obj[key] + ';';
            }
            return params;
        };
        var elem = document.createElement(name);//Create element

        if (attributes) {//Sets attributes for this element
            for (var key in attributes) {
                (attributes[key] instanceof Object) ?
                    elem[key] = concatStyle(attributes[key])//If value is object - concatination it
                    :
                    elem[key] = attributes[key];
            }
        }

        if (children) { //Add child elements to this element
            if (Array.isArray(children)) {
                children.forEach((item) => {
                    (typeof item === 'string') ?
                        elem.appendChild(document.createTextNode(item))
                        :
                        elem.appendChild(item);
                });
            } else {
                elem.textContent = children;
            }
        }

        return elem;
    },

};

