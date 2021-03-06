export default worldUrl => {
    /*eslint no-console: 0 */
    const _ = {checker: [], ocn: 0, spd: 10, pan: 0, clr: 0};

    _.checker = [
        ':Shadow:showDropShadow',
        ':Ocean:showOcean',
        ':Graticule:showGraticule',
        ':Land:showLand',
        ':Country:showCountries',
        ':Lakes:showLakes',
        ':Transparent:transparent',
        ':Canvas:showCanvas',
        ':Spin:spin',
    ].map(d => d.split(':'));

    function addPlugins() {
        const r = this.register;
        const p = earthjs.plugins;
        r(p.mousePlugin());
        r(p.autorotatePlugin());
        r(p.dropShadowSvg());
        r(p.oceanSvg());
        r(p.canvasPlugin());
        r(p.graticuleCanvas());
        r(p.worldCanvas(worldUrl));
        this._.options.transparent = true;
        this.canvasPlugin.selectAll('.ej-canvas');
        this.graticuleCanvas.drawTo([1]);
        this.worldCanvas.drawTo([0]);

        _.options = this._.options;
        _.buttonClick = str => {
            const arr = str.split(':'),
                key = arr[2],
                resultx  = {},
                options  = this._.options;
            options[key] = !options[key];
            resultx[key] =  options[key];
            if (key=='transparent') {
                if (options.transparentGraticule || options.transparentLand) {
                    resultx.transparent = false;
                }
                resultx.transparentGraticule = false;
                resultx.transparentLand = false;
            } else if (key=='showCountries' || key=='showLakes') {
                resultx.showLand = true;
            } else if (key=='transparentGraticule' || key=='transparentLand') {
                if (options.transparent) {
                    resultx.transparentGraticule = false;
                    resultx.transparentLand = false;
                }
                resultx.transparent = false;
            }
            // this.configPlugin.set(resultx);
        };
    }

    function rangeInput(opt, id, min, max, stp, vl, handler) {
        opt.append('br');
        opt.append('input')
        .attr('id', id)
        .attr('type', 'range')
        .attr('min', min)
        .attr('max', max)
        .attr('step',stp)
        .attr('value',vl)
        .on('input', handler);
    }

    function enableController() {
        const _this = this;
        const opt = d3.select('.set-options');
        const opt2= d3.select('.set-options2');
        opt.selectAll('button, input, br').remove();
        opt2.selectAll('button, input, br').remove();
        if (this._.options.showControll) {
            opt.selectAll('button').data(_.checker).enter().append('button')
            .text(d => d[1])
            .on('click', d => _.buttonClick.call(this, d.join(':')));
            rangeInput(opt2, 'pan', 0, 400, 1, _.pan, function() {
                _.pan = +this.value;
                for(let i=1;i<nodes.length;i++) {
                    nodes[i].style.left = (_.pan* i)+'px';
                }
            })
            rangeInput(opt2, 'ocn', 0, 20, 1, _.ocn, function() {
                _.ocn = this.value;_this.oceanSvg.scale(-_.ocn);
            })
            rangeInput(opt2, 'spd', 10, 200, 10, _.spd, function() {
                _.spd = this.value;_this.autorotatePlugin.speed(_.spd);
            })
            const nodes = d3.selectAll('.ea-layer').nodes();
        }
    }

    return {
        name: 'commonPlugins',
        onInit(me) {
            _.me = me;
            addPlugins.call(this);
            this._.options.showControll = true;
        },
        onCreate() {
            enableController.call(this);
        },
        addChecker(checker) {
            _.checker.push(checker);
            _.options = this._.options();
            enableController.call(this);
        }
    }
}
