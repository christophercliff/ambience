(function($){
    
    function Framerate()
    {
        return this;
    };
    
    Framerate.prototype.setRate = function (rate)
    {
        this.frameLen = 1000 / rate;
    };
    
    Framerate.prototype.getFrames = function ()
    {
        var d = new Date(),
            currTime = d.getTime();
        
        delete d;
        
        var totalFrames = 0;
        
        while (this.prevTime + this.frameLen <= currTime)
        {
            this.prevTime += this.frameLen;
            
            totalFrames++;
        }
        
        return totalFrames;
    };
    
    Framerate.prototype.reset = function()
    {
        var d = new Date();
        
        this.prevTime = d.getTime();
        
        delete d;
    };
    
    $.widget('ui.ambience', {
        
        options: {
            backgrounds: [
                '#dedbc3',
                '#dec3c3',
                '#dec3db',
                '#c3d1de',
                '#c3deca'
            ],
            foregrounds: [
                '#fff'
            ],
            duration: 10, // (s)
            framerate: 30, // (fps)
            interval: 100 // (ms)
        },
        
        _create: function () {
            
            var self = this,
                options = self.options,
                $el = self.element,
                $canvas = $('<canvas/>'),
                canvas = $canvas.get(0),
                w_el = $el.width(),
                h_el = $el.width(),
                x_0 = w_el/2,
                y_0 = h_el/2,
                r_0 = 0,
                x_1 = w_el/2*2,
                y_1 = h_el/2 + h_el/2*(Math.floor(Math.random()*2) - 1),
                r_1 = w_el*2,
                context,
                gradient,
                t_0 = 0,
                t_n = t_0,
                t_1 = t_0 + options.duration,
                fg_0 = self._getRandomColor(options.foregrounds),
                bg_0 = self._convertToRGB(fg_0),
                bg_n = bg_0,
                bg_1 = self._convertToRGB(self._getRandomColor(options.backgrounds)),
                framerate = new Framerate();
                
            $canvas
                .attr('width', w_el)
                .attr('height', h_el)
                .css({
                    position: 'absolute'
                })
                .appendTo($el)
                ;
            
            framerate.setRate(options.framerate);
            framerate.reset();
            
            if (!canvas.getContext)
            {
                return;
            }
            
            context = canvas.getContext('2d');
            gradient = context.createRadialGradient(x_0, y_0, r_0, x_1, y_1, r_1);
            
            gradient.addColorStop(0.00, fg_0);
            gradient.addColorStop(0.50, fg_0);
            
            context.fillStyle = gradient;
            context.fillRect(0, 0, w_el, h_el);
            
            setInterval(function(){
                
                var t_rel;
                
                t_n += framerate.getFrames()/options.duration;
                
                if (t_n >= t_1)
                {
                    t_0 = t_n;
                    t_1 = t_n + options.duration;
                    bg_0 = bg_n;
                    bg_1 = self._convertToRGB(self._getRandomColor(options.backgrounds));
                }
                
                t_rel = (t_n - t_0)/(t_1 - t_0);
                
                bg_n = [
                    Math.max(Math.min(parseInt((t_rel * (bg_1[0] - bg_0[0])) + bg_0[0]), 255), 0),
                    Math.max(Math.min(parseInt((t_rel * (bg_1[1] - bg_0[1])) + bg_0[1]), 255), 0),
                    Math.max(Math.min(parseInt((t_rel * (bg_1[2] - bg_0[2])) + bg_0[2]), 255), 0)
                ];
                
                self._draw(context, 'rgb(' + bg_n.join(',') + ')');
                
            }, options.interval);
            
        },
        
        _draw: function (context, color) {
            
            var self = this,
                options = self.options,
                $el = self.element
                ;
            
            var w_el = $el.width(),
                h_el = $el.height(),
                x_0 = w_el/2,
                y_0 = h_el/2,
                r_0 = 0,
                x_1 = w_el/2,
                y_1 = h_el/2,
                r_1 = w_el*2,
                gradient = context.createRadialGradient(x_0, y_0, r_0, x_1, y_1, r_1);
            
            gradient.addColorStop(0.00, options.foregrounds[0]);
            gradient.addColorStop(0.50, color);
            
            context.fillStyle = gradient;
            context.fillRect(0, 0, w_el, h_el);
            context.fillRect(100, 100, w_el, h_el);
            
            return;
        },
        
        _convertToRGB: function (color) {
            
            var result;
            
            // Check if we're already dealing with an array of colors
            if ( color && color.constructor == Array && color.length == 3 )
                return color;
            
            // Look for rgb(num,num,num)
            if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
                return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];
            
            // Look for rgb(num%,num%,num%)
            if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
                return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];
            
            // Look for #a0b1c2
            if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
                return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];
            
            // Look for #fff
            if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
                return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];
            
            // Otherwise, we're most likely dealing with a named color
            return colors[jQuery.trim(color).toLowerCase()];
        },
        
        _getRandomColor: function (colors) {
            return colors[Math.floor(Math.random()*colors.length)];
        }
        
    });
    
})(jQuery);