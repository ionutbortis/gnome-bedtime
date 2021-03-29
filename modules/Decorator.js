const { Gio, GLib, St } = imports.gi;
const { main } = imports.ui;
const { Button: PanelMenuButton } = imports.ui.panelMenu;
const { PopupImageMenuItem } = imports.ui.popupMenu;

const { extensionUtils } = imports.misc;

const Me = extensionUtils.getCurrentExtension();

const extension = Me.imports.extension;

const { logDebug } = Me.imports.utils;

var Decorator = class {
  constructor() {
    this._button = null;

    this._bedtimeModeActiveConnect = null;
    this._buttonLocationConnect = null;
  }

  enable() {
    logDebug("Enabling Decorator...");

    this._connectSettings();
    this._addButton();
  }

  disable() {
    logDebug("Disabling Decorator...");

    this._disconnectSettings();
    this._removeButton();
  }

  _connectSettings() {
    logDebug("Connecting Decorator to settings...");

    this._bedtimeModeActiveConnect = extension.settings.connect("bedtime-mode-active-changed", this._onBedtimeModeActiveChanged.bind(this));
    this._buttonLocationConnect = extension.settings.connect("button-location-changed", this._onButtonLocationChanged.bind(this));
  }

  _disconnectSettings() {
    logDebug("Disconnecting Decorator from settings...");

    extension.settings.disconnect(this._bedtimeModeActiveConnect);
    extension.settings.disconnect(this._buttonLocationConnect);
  }

  _addButton() {
    switch (extension.settings.buttonLocation) {
      case "bar":
        this._addButtonToBar();
        break;
      case "menu":
        this._addButtonToMenu();
        break;
    }
  }

  _removeButton() {
    if (this._button) {
      logDebug("Removing On-demand button...");

      this._button.destroy();
      this._button = null;
    }
  }

  _addButtonToBar() {
    logDebug("Adding On-demand button to the system bar...");

    const icon = new St.Icon({
      gicon: this._getButtonIcon(),
      style_class: "system-status-icon",
    });

    this._button = new PanelMenuButton(0.0);

    this._button.add_actor(icon);
    this._button.connect("button-press-event", () => this._toggleBedtimeMode());
    this._button.connect("touch-event", () => this._toggleBedtimeMode());
    this._button.update = () => {
      icon.gicon = this._getButtonIcon();
    };

    main.panel.addToStatusArea("BedtimeModeToggleButton", this._button);
  }

  _addButtonToMenu() {
    logDebug("Adding On-demand button to the system menu...");

    this._button = new PopupImageMenuItem(this._getMenuItemLabel(), this._getButtonIcon());

    this._button.connect("activate", () => this._toggleBedtimeMode());
    this._button.update = () => {
      this._button.label.text = this._getMenuItemLabel();
      this._button.setIcon(this._getButtonIcon());
    };

    const aggregateMenu = main.panel.statusArea.aggregateMenu;

    aggregateMenu.menu.addMenuItem(this._button, this._getMenuItemPosition(aggregateMenu));
  }

  _getButtonIcon() {
    const name = extension.settings.bedtimeModeActive ? "bedtime-mode-on" : "bedtime-mode-off";
    return Gio.icon_new_for_string(GLib.build_filenamev([Me.path, "icons", "status", `${name}.svg`]));
  }

  _getMenuItemLabel() {
    return extension.settings.bedtimeModeActive ? "Turn Off Bedtime Mode" : "Turn On Bedtime Mode";
  }

  _getMenuItemPosition(aggregateMenu) {
    const items = aggregateMenu.menu._getMenuItems();
    return items.indexOf(aggregateMenu._system.menu) - 1;
  }

  _updateButton() {
    if (this._button) {
      logDebug("Updating On-demand button state...");

      this._button.update();
    }
  }

  _onBedtimeModeActiveChanged() {
    this._updateButton();
  }

  _onButtonLocationChanged() {
    this._removeButton();
    this._addButton();
  }

  _toggleBedtimeMode() {
    extension.settings.bedtimeModeActive = !extension.settings.bedtimeModeActive;
  }
};
