var Firebase = require('firebase');

module.exports = {
    fb: undefined,

    getFb: function() {
        if (this.fb) {
            return this.fb;
        } else {
            this.fb = new Firebase('https://bootycall.firebaseio.com');
            return this.fb;
        }
    }
}
