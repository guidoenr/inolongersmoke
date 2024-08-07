import GObject from 'gi://GObject';
import St from 'gi://St';
import GLib from 'gi://GLib'; 
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';


// javascript months are 0-indexed. XD fuck JS devs
const START_DATE = new Date(2024, 5, 20); 

const calculateDaysSinceStart = () => {
    const today = new Date();
    const diffTime = today - START_DATE;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('Days Since Start'));

        this._label = new St.Label({
            text: `no fumo hace ${calculateDaysSinceStart()} dias`,
            style_class: 'system-status-icon'
            //y_expand: true,
            //text_color: 
        });

        this.add_child(this._label);
        this._updateCounter();
    }

    _updateCounter() {
        this._label.text = `no fumo hace ${calculateDaysSinceStart()} dias`;
        // update it each 24 hours
        this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 86400, () => {
            this._label.text = `no fumo hace ${calculateDaysSinceStart()} dias`;
            return GLib.SOURCE_CONTINUE;
        });
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
