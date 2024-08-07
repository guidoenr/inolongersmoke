import GObject from 'gi://GObject';
import St from 'gi://St';
import GLib from 'gi://GLib'; 
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// actually this is JUNE, but JS devs counts dates indexed by 0
const START_DATE = new Date(2024, 5, 20);

const calculateDaysSinceStart = () => {
    const today = new Date();
    const diffTime = today - START_DATE;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('Days Since Start'));

        this._label = new St.Label({
            text: `No fumo hace ${calculateDaysSinceStart()} días`,
            style_class: 'indicator-label'
        });

        this.add_child(this._label);
        this._updateCounter();
        
        // Connect click event
        this.connect('button-press-event', this._onClick.bind(this));
    }

    _updateCounter() {
        this._label.text = `No fumo hace ${calculateDaysSinceStart()} días`;
        // Update it every 24 hours
        this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 86400, () => {
            this._label.text = `No fumo hace ${calculateDaysSinceStart()} días`;
            return GLib.SOURCE_CONTINUE;
        });
    }

    _onClick() {
        this._label.style = `color: ${getRandomColor()};`;  // Change to a random color on click
    }

    destroy() {
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
        }
        super.destroy();
    }
});

export default class IndicatorExampleExtension extends Extension {
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}
