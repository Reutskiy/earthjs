// Mike Bostock’s Block https://bl.ocks.org/mbostock/7ea1dde508cec6d2d95306f92642bc42
//
import versorFn from '../versor.js';

var versor = versorFn();
export default function() {
    return {
        name: 'versorDragPlugin',
        onInit() {
            var _this = this;
            this._.svg.call(d3.drag()
                .on('start', dragstarted)
                .on('end',   dragsended)
                .on('drag',  dragged));

            var v0, // Mouse position in Cartesian coordinates at start of drag gesture.
                r0, // Projection rotation as Euler angles at start.
                q0; // Projection rotation as versor at start.

            function dragstarted() {
                _this._.drag = true;
                v0 = versor.cartesian(_this._.proj.invert(d3.mouse(this)));
                r0 = _this._.proj.rotate();
                q0 = versor(r0);
            }

            function dragsended() {
                _this._.drag = false;
            }

            function dragged() {
                var v1 = versor.cartesian(_this._.proj.rotate(r0).invert(d3.mouse(this))),
                    q1 = versor.multiply(q0, versor.delta(v0, v1)),
                    r1 = versor.rotation(q1);
                _this._.rotate(r1);
            }
        }
    }
}
