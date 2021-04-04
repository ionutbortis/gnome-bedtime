"use strict";

const Signals = imports.signals;
const { extensionUtils } = imports.misc;

const Me = extensionUtils.getCurrentExtension();

const { logDebug } = Me.imports.utils;

var Settings = class {
  constructor() {
    logDebug("Initializing Settings...");

    this._bedtimeModeActiveConnect = null;
    this._automaticScheduleConnect = null;
    this._buttonLocationConnect = null;
    this._buttonVisibilityConnect = null;
    this._buttonBarManualPositionConnect = null;
    this._buttonBarPositionValueConnect = null;

    this._scheduleStartHoursConnect = null;
    this._scheduleStartMinutesConnect = null;
    this._scheduleEndHoursConnect = null;
    this._scheduleEndMinutesConnect = null;

    this.gSettings = extensionUtils.getSettings();
  }

  enable() {
    logDebug("Connecting settings signals...");

    this._bedtimeModeActiveConnect = this.gSettings.connect("changed::bedtime-mode-active", this._onBedtimeModeActiveChanged.bind(this));
    this._automaticScheduleConnect = this.gSettings.connect("changed::automatic-schedule", this._onAutomaticScheduleChanged.bind(this));
    this._buttonVisibilityConnect = this.gSettings.connect("changed::ondemand-button-visibility", this._onButtonVisibilityChanged.bind(this));
    this._buttonLocationConnect = this.gSettings.connect("changed::ondemand-button-location", this._onButtonLocationChanged.bind(this));
    this._buttonBarManualPositionConnect = this.gSettings.connect(
      "changed::ondemand-button-bar-manual-position",
      this._onButtonBarManualPositionChanged.bind(this)
    );
    this._buttonBarPositionValueConnect = this.gSettings.connect(
      "changed::ondemand-button-bar-position-value",
      this._onButtonBarPositionValueChanged.bind(this)
    );

    this._scheduleStartHoursConnect = this.gSettings.connect("changed::schedule-start-hours", this._onScheduleTimesChanged.bind(this));
    this._scheduleStartMinutesConnect = this.gSettings.connect("changed::schedule-start-minutes", this._onScheduleTimesChanged.bind(this));
    this._scheduleEndHoursConnect = this.gSettings.connect("changed::schedule-end-hours", this._onScheduleTimesChanged.bind(this));
    this._scheduleEndMinutesConnect = this.gSettings.connect("changed::schedule-end-minutes", this._onScheduleTimesChanged.bind(this));
  }

  disable() {
    logDebug("Disconnecting settings signals...");

    this.gSettings.disconnect(this._bedtimeModeActiveConnect);
    this.gSettings.disconnect(this._automaticScheduleConnect);
    this.gSettings.disconnect(this._buttonLocationConnect);
    this.gSettings.disconnect(this._buttonVisibilityConnect);
    this.gSettings.disconnect(this._buttonBarManualPositionConnect);
    this.gSettings.disconnect(this._buttonBarPositionValueConnect);

    this.gSettings.disconnect(this._scheduleStartHoursConnect);
    this.gSettings.disconnect(this._scheduleStartMinutesConnect);
    this.gSettings.disconnect(this._scheduleEndHoursConnect);
    this.gSettings.disconnect(this._scheduleEndMinutesConnect);
  }

  get bedtimeModeActive() {
    return this.gSettings.get_boolean("bedtime-mode-active");
  }

  set bedtimeModeActive(value) {
    value !== this.bedtimeModeActive && this.gSettings.set_boolean("bedtime-mode-active", value);
  }

  get automaticSchedule() {
    return this.gSettings.get_boolean("automatic-schedule");
  }

  set automaticSchedule(value) {
    value !== this.automaticSchedule && this.gSettings.set_boolean("automatic-schedule", value);
  }

  get buttonBarManualPosition() {
    return this.gSettings.get_boolean("ondemand-button-bar-manual-position");
  }

  get buttonBarPositionValue() {
    return this.gSettings.get_int("ondemand-button-bar-position-value");
  }

  get buttonLocation() {
    return this.gSettings.get_string("ondemand-button-location");
  }

  get buttonVisibility() {
    return this.gSettings.get_string("ondemand-button-visibility");
  }

  get scheduleStartHours() {
    return this.gSettings.get_int("schedule-start-hours");
  }

  get scheduleStartMinutes() {
    return this.gSettings.get_int("schedule-start-minutes");
  }

  get scheduleEndHours() {
    return this.gSettings.get_int("schedule-end-hours");
  }

  get scheduleEndMinutes() {
    return this.gSettings.get_int("schedule-end-minutes");
  }

  _onBedtimeModeActiveChanged() {
    logDebug(`Bedtime Mode Active changed to '${this.bedtimeModeActive}'`);

    this.emit("bedtime-mode-active-changed", this.bedtimeModeActive);
  }

  _onAutomaticScheduleChanged() {
    logDebug(`Automatic Schedule changed to '${this.automaticSchedule}'`);

    this.emit("automatic-schedule-changed", this.automaticSchedule);
  }

  _onButtonLocationChanged() {
    logDebug(`Button Location changed to '${this.buttonLocation}'`);

    this.emit("button-location-changed", this.buttonLocation);
  }

  _onButtonVisibilityChanged() {
    logDebug(`Button Visibility changed to '${this.buttonVisibility}'`);

    this.emit("button-visibility-changed", this.buttonVisibility);
  }

  _onButtonBarManualPositionChanged() {
    logDebug(`Button Bar Manual Position changed to '${this.buttonBarManualPosition}'`);

    this.emit("button-bar-manual-position-changed", this.buttonBarManualPosition);
  }

  _onButtonBarPositionValueChanged() {
    logDebug(`Button Bar Position Value changed to '${this.buttonBarPositionValue}'`);

    this.emit("button-bar-position-value-changed", this.buttonBarPositionValue);
  }

  _onScheduleTimesChanged() {
    const start = `Start=${this.scheduleStartHours}:${this.scheduleStartMinutes}`;
    const end = `End=${this.scheduleEndHours}:${this.scheduleEndMinutes}`;
    logDebug(`Schedule Times changed to: ${start} ${end}`);

    this.emit("schedule-times-changed", {});
  }
};

Signals.addSignalMethods(Settings.prototype);
