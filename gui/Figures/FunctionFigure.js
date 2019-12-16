function setPortCount(figure, portCount) {
    while (figure.getInputPorts().data.length < portCount) { // Add ports
        var port = figure.createPort("input");
        port.onConnect = function() {
            figure.calc();
        }

        port.onDisconnect = function() {
            figure.calc();
        }
    }

    while (figure.getInputPorts().data.length > portCount) { // Add ports
        figure.removePort(figure.getInputPorts().data[figure.getInputPorts().data.length - 1]);
    }

    figure.repaint();
}

example.FunctionFigure = draw2d.shape.basic.Rectangle.extend({

    NAME: "example.FunctionFigure",
    applyListeners: function(figure, html) {
        for (const key of Object.keys(figure.parameters)) {
            if(figure.parameters[key].input === "input" || figure.parameters[key].input === "textarea") {
                $("#property_" + key).on("input", function(){
                    figure.setParameter(key, $("#property_"+key).val(), html);
                });
            } else {
                $("#property_" + key).on("change", function(){
                    figure.setParameter(key, $("#property_"+key).val(), html);
                });
            }
        }
    },
    init: function () {
        this._super();

        this.setBackgroundColor("f0f0ff");
        this.setStroke(1);
        this.setDimension(50, 50);
        this.setResizeable(false);
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());

        this.label = new draw2d.shape.basic.Label({ text: "+" });
        this.label.setStroke(0);
        this.label.setFontSize(24);

        this.add(this.label, new draw2d.layout.locator.CenterLocator(this));

        this.result = new draw2d.shape.basic.Label({ text: 0 });
        this.result.setStroke(0);
        this.result.setFontSize(16);
        this.add(this.result, new draw2d.layout.locator.BottomLocator(this));

        this.parameters = {
            type: {
                value: "Add",
                f: function (figure, value, html) {
                    figure.parameters.type.value = value;

                    figure.parameters.value.input = 'none';
                    figure.parameters.ports.input = 'none';
                    switch (value) {
                        case "Add":
                            figure.label.setText("+");
                            setPortCount(figure, 1);
                            break;
                        case "Subtract":
                            figure.label.setText("-");
                            setPortCount(figure, 2);
                            break;
                        case "Multiply":
                            figure.label.setText("*");
                            setPortCount(figure, 1);
                            break;
                        case "Divide":
                            figure.label.setText("/");
                            setPortCount(figure, 2);
                            break;
                        case "Count":
                            figure.label.setText("#");
                            setPortCount(figure, 1);
                            break;
                        case "Function":
                            figure.label.setText("f()");
                            figure.parameters.value.input = 'textarea';
                            figure.parameters.ports.input = 'input';
                            setPortCount(figure, 1);
                            break;
                    }

                    html.empty();
                    html.append(figure.getPropertyPane());

                    figure.applyListeners(figure, html);

                    figure.calc();
                },
                input: "select",
                name: "Type",
                options: ["Add", "Subtract", "Multiply", "Divide", "Count", "Function"]
            },
            value: {
                value: "",
                f: function (figure, value) {
                    figure.parameters.value.value = value;
                    figure.calc();
                },
                input: "none",
                name: "Value"
            },
            ports: {
                value: 1,
                f: function (figure, value) {
                    figure.parameters.ports.value = value;
                    setPortCount(figure, value);
                },
                input: "none",
                name: "Ports"
            },
            output: {
                value: 0,
                f: function (figure, value) {
                    figure.parameters.output.value = parseFloat(value);
                    figure.result.setText(value);

                    var children = getSiblings(figure.getOutputPort(0));
                    for(var child of children) {
                        child.calc();
                    }
                },
                input: "none",
                name: "Output"
            }
        }

        setPortCount(this, 1);
        this.createPort("output");
    },

    calc:  function () {
        switch (this.parameters.type.value) {
            case "Add":
                var a = getSiblings(this.getInputPorts().data[0]);

                var output = 0;

                for(var i of a) {
                    output = output + i.parameters.output.value;
                }

                this.setParameter('output', output);
                break;
            case "Subtract":
                var a = getSiblings(this.getInputPorts().data[0]);
                var b = getSiblings(this.getInputPorts().data[1]);

                if(a.length >= 1 && b.length >= 1) {
                    var output = a[0].parameters.output.value - b[0].parameters.output.value;
                } else {
                    var output = NaN;
                }
                 
                this.setParameter('output', output);
                break;
            case "Multiply":
                var a = getSiblings(this.getInputPorts().data[0]);

                var output = 0;

                for(var i of a) {
                    output = output * i.parameters.output.value;
                }

                this.setParameter('output', output);
                break;
            case "Divide":
                var a = getSiblings(this.getInputPorts().data[0]);
                var b = getSiblings(this.getInputPorts().data[1]);

                if(a.length >= 1 && b.length >= 1) {
                    var output = a[0].parameters.output.value / b[0].parameters.output.value;
                } else {
                    var output = NaN;
                }
                 
                this.setParameter('output', output);
                break;
            case "Count":
                var a = getSiblings(this.getInputPorts().data[0]);

                this.setParameter('output', a.length);
                break;
            case "Function":
                var inputs = [];
                var abc = "abcdefghijklmnopqrstuvwxyz";

                for(var i = 0; i < this.parameters.ports.value; i++) {
                    var siblings = getSiblings(this.getInputPorts().data[i]);
                    var siblingInputs = [];

                    for(var sibling of siblings) {
                        siblingInputs.push(sibling.parameters.output.value);
                    }

                    if(siblingInputs.length === 0) {
                        inputs.push(undefined);
                    } else if(siblingInputs.length === 1) {
                        inputs.push(siblingInputs[0]);
                    } else {
                        inputs.push(siblingInputs);
                    }
                }
                try {
                    var output = new Function("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", this.parameters.value.value)(...inputs);
                } catch(e) {
                    var output = undefined;
                }
                
                this.setParameter('output', output);
                break;
        }
    },

    createSet: function () {
        var set = this._super();

        set.push(this.canvas.paper.circle(20, 20, 10));
        return set;
    },
    getUserData: function () {
        return {
            type: type,
            value: value
        };
    },

    getPropertyPane: function () {
        var html = '<div id="property_position_container" class="panel panel-default">' +
            ' <div class="panel-heading " >' +
            '     Properties' +
            '</div>' +
            ' <div class="panel-body" id="userdata_panel">' +
            '   <div class="form-group">';

        for (var key of Object.keys(this.parameters)) {
            if (this.parameters[key].input === "input") {
                html = html + '       <div class="input-group" ></div> ' +
                    '       ' + this.parameters[key].name + ' <input id="property_' + key + '" type="text" class="form-control" value="' + this.parameters[key].value + '"/>';
            } else if (this.parameters[key].input === "select") {
                html = html + '       <div class="input-group" ></div> ' +
                    '       ' + this.parameters[key].name + ' <select id="property_' + key + '" class="form-control">';

                for (var option of this.parameters[key].options) {
                    if (option === this.parameters[key].value) {
                        html = html + '             <option value="' + option + '" selected>' + option + '</option> ';
                    } else {
                        html = html + '             <option value="' + option + '">' + option + '</option> ';
                    }
                }

                html = html + "</select>";
            } else if (this.parameters[key].input === "textarea") {
                html = html + '       <div class="input-group" ></div> ' +
                    '       ' + this.parameters[key].name + ' <textarea id="property_' + key + '" type="text" rows="10" class="form-control">' + this.parameters[key].value + '</textarea>';
            }
        }

        html = html + '</div>' +
            ' </div>' +
            '</div>';

        return html;
    },

    setParameter: function (name, value, html) {
        this.parameters[name].f(this, value, html);
    },
    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes : function()
    {
        var memento = this._super();
        return memento;
    },
    
    /**
     * @method 
     * Read all attributes from the serialized properties and transfer them into the shape.
     * 
     * @param {Object} memento
     * @returns 
     */
    setPersistentAttributes : function(memento)
    {
        this._super(memento);

        this.parameters = {
            type: {
                value: "Add",
                f: function (figure, value, html) {
                    figure.parameters.type.value = value;

                    figure.parameters.value.input = 'none';
                    figure.parameters.ports.input = 'none';
                    switch (value) {
                        case "Add":
                            figure.label.setText("+");
                            setPortCount(figure, 1);
                            break;
                        case "Subtract":
                            figure.label.setText("-");
                            setPortCount(figure, 2);
                            break;
                        case "Multiply":
                            figure.label.setText("*");
                            setPortCount(figure, 1);
                            break;
                        case "Divide":
                            figure.label.setText("/");
                            setPortCount(figure, 2);
                            break;
                        case "Count":
                            figure.label.setText("#");
                            setPortCount(figure, 1);
                            break;
                        case "Function":
                            figure.label.setText("f()");
                            figure.parameters.value.input = 'textarea';
                            figure.parameters.ports.input = 'input';
                            setPortCount(figure, 1);
                            break;
                    }

                    html.empty();
                    html.append(figure.getPropertyPane());

                    figure.applyListeners(figure, html);

                    figure.calc();
                },
                input: "select",
                name: "Type",
                options: ["Add", "Subtract", "Multiply", "Divide", "Count", "Function"]
            },
            value: {
                value: "",
                f: function (figure, value) {
                    figure.parameters.value.value = value;
                    figure.calc();
                },
                input: "none",
                name: "Value"
            },
            ports: {
                value: 1,
                f: function (figure, value) {
                    figure.parameters.ports.value = value;
                    setPortCount(figure, value);
                },
                input: "none",
                name: "Ports"
            },
            output: {
                value: 0,
                f: function (figure, value) {
                    figure.parameters.output.value = parseFloat(value);
                    figure.result.setText(value);

                    var children = getSiblings(figure.getOutputPort(0));
                    for(var child of children) {
                        child.calc();
                    }
                },
                input: "none",
                name: "Output"
            }
        }
        
        for(var key of Object.keys(this.userData)) {
            this.setParameter(key, this.userData[key].value, app.properties.html);
        }

        this.applyListeners(this, app.properties.html);
    }
});

