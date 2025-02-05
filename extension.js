// date since i stopped : 20 June 2024
const START_DATE = new Date(2024, 5, 20);
const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const _ = ExtensionUtils.gettext;
const { GObject, St, GLib } = imports.gi;

// function to calculate the number of days since the start date
const calculateDaysSinceStart = () => {
    const today = new Date();
    const diffTime = today - START_DATE;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// function to generate a random hex color
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
            text: `🚬 ${calculateDaysSinceStart()} días`,
            style_class: 'indicator-label center-text'
        });

        this.add_child(this._label);
        this._updateCounter();
        
        // connect click event
        this.connect('button-press-event', this._onClick.bind(this));
    }

    // update the counter display
    _updateCounter() {
        this._label.text = `🚬  ${calculateDaysSinceStart()} días`;
        // update it every 24 hours
        this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 86400, () => {
            this._label.text = `🚬  ${calculateDaysSinceStart()} días`;
            return GLib.SOURCE_CONTINUE;
        });
    }

    // change text color to a random color on click
    _onClick() {
        this._label.style = `color: ${getRandomColor()};`;
    }

    destroy() {
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
        }
        super.destroy();
    }
});

class IndicatorExampleExtension {
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea('inolongersmoke@guidoenr', this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init() {
    ExtensionUtils.initTranslations('inolongersmoke@guidoenr');
    return new IndicatorExampleExtension();
}
