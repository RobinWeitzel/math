example.DataFigure = draw2d.shape.basic.Circle.extend({

    NAME: "example.DataFigure",

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
    init : function()
    {
        this._super();

        this.setBackgroundColor("f0f0ff");
        this.setStroke(1);
        this.setDiameter(50);
        this.setResizeable(false);
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());

        this.parameters = {
            type: {
                value: "Number",
                f: function(figure, value, html) {
                    figure.parameters.type.value = value;
                    if(value === "JSON") {
                        figure.parameters.output.input = 'textarea';
                        figure.label.setText("{}");
                    } else if(value === "Number") {
                        figure.parameters.output.input = 'input';
                        figure.label.setText(figure.parameters.output.value);          
                    }   
                    
                    html.empty();
                    html.append(figure.getPropertyPane());

                    figure.applyListeners(figure, html);
                },
                input: "select",
                name: "Type",
                options: ["Number", "JSON"]
            },
            output: {
                value: 0,
                f: function(figure, value) {
                    if(figure.parameters.type.value === "Number") {
                        figure.parameters.output.value = parseFloat(value);
                        figure.label.setText(value);
                    } else {
                        try {
                            figure.parameters.output.value = JSON.parse(value);
                        } catch(e) {
                            figure.parameters.output.value = undefined;
                        }
                    }

                    var children = getSiblings(figure.getOutputPort(0));
                    for(var child of children) {
                        child.calc();
                    }
                },
                input: "input",
                name: "Value"
            }
        }
        
        this.label = new draw2d.shape.basic.Label({text:this.parameters.output.value});
        this.label.setStroke(0);
        this.label.setFontSize(16);

        this.add(this.label, new draw2d.layout.locator.CenterLocator(this));

        this.createPort("output");
    },

    createSet: function(){
        var set = this._super();

        //set.push( this.canvas.paper.circle(20, 20, 10));
        return set;
    },

    getPropertyPane: function() {
        var html = '<div id="property_position_container" class="panel panel-default">'+
        ' <div class="panel-heading " >'+
        '     Properties'+
        '</div>'+
        ' <div class="panel-body" id="userdata_panel">'+
        '   <div class="form-group">';

        for (var key of Object.keys(this.parameters)) {
            if(this.parameters[key].input === "input") {
                html = html + '       <div class="input-group" ></div> '+ 
            '       '+this.parameters[key].name+' <input id="property_'+key+'" type="text" class="form-control" value="'+this.parameters[key].value+'"/>';
            } else if(this.parameters[key].input === "select") {
                html = html + '       <div class="input-group" ></div> '+ 
            '       '+this.parameters[key].name+' <select id="property_'+key+'" class="form-control">';

                for(var option of this.parameters[key].options) {
                    if(option === this.parameters[key].value) {
                        html = html + '             <option value="'+option+'" selected>'+option+'</option> ';
                    } else {
                        html = html + '             <option value="'+option+'">'+option+'</option> ';
                    }
                }

                html = html + "</select>";
            } else if(this.parameters[key].input === "textarea") {
                html = html + '       <div class="input-group" ></div> '+ 
            '       '+this.parameters[key].name+' <textarea id="property_'+key+'" type="text" rows="6" class="form-control">'+JSON.stringify(this.parameters[key].value)+'</textarea>';
            }
        }
        
        html = html + '</div>'+
        ' </div>'+
        '</div>';

        return html;
    },

    setParameter: function(name, value, html) {
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
                value: "Number",
                f: function(figure, value, html) {
                    figure.parameters.type.value = value;
                    if(value === "JSON") {
                        figure.parameters.output.input = 'textarea';
                        figure.label.setText("{}");
                    } else if(value === "Number") {
                        figure.parameters.output.input = 'input';
                        figure.label.setText(figure.parameters.output.value);          
                    }   
                    
                    html.empty();
                    html.append(figure.getPropertyPane());

                    figure.applyListeners(figure, html);
                },
                input: "select",
                name: "Type",
                options: ["Number", "JSON"]
            },
            output: {
                value: 0,
                f: function(figure, value) {
                    if(figure.parameters.type.value === "Number") {
                        figure.parameters.output.value = parseFloat(value);
                        figure.label.setText(value);
                    } else {
                        try {
                            figure.parameters.output.value = JSON.parse(value);
                        } catch(e) {
                            figure.parameters.output.value = undefined;
                        }
                    }

                    var children = getSiblings(figure.getOutputPort(0));
                    for(var child of children) {
                        child.calc();
                    }
                },
                input: "input",
                name: "Value"
            }
        }
        
        for(var key of Object.keys(this.userData)) {
            this.setParameter(key, this.userData[key].value, app.properties.html);
        }

        this.applyListeners(this, app.properties.html);
    }
});

