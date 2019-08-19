import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import interactionPlugin from '@fullcalendar/interaction';
import enLocale from '@fullcalendar/core/locales/en-gb';
import svLocale from '@fullcalendar/core/locales/sv';
import fiLocale from '@fullcalendar/core/locales/fi';
import moment from 'moment';
import get from 'lodash/get';
import classNames from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import constants from '../../../../app/constants/AppConstants';
import * as resourceUtils from '../utils';
import injectT from '../../../../app/i18n/injectT';

class ResourceReservationCalendar extends React.Component {
  calendarRef = React.createRef();

  static propTypes = {
    date: PropTypes.string,
    intl: intlShape,
    resource: PropTypes.object.isRequired,
    onDateChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    selected: null,
    view: 'timeGridWeek',
  };

  componentDidUpdate(prevProps) {
    const { date } = this.props;

    if (date !== prevProps.date) {
      const calendarApi = this.calendarRef.current.getApi();
      calendarApi.gotoDate(date);
    }
  }

  getCalendarOptions = () => {
    const {
      intl,
      resource,
    } = this.props;

    return {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridDay,timeGridWeek'
      },
      height: 'auto',
      editable: true,
      firstDay: 1,
      locale: intl.locale,
      locales: [enLocale, svLocale, fiLocale],
      nowIndicator: true,
      plugins: [timeGridPlugin, momentTimezonePlugin, interactionPlugin],
      selectable: true,
      slotDuration: resource.slot_size,
      selectOverlap: false,
      selectConstraint: 'businessHours',
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: 'short'
      },
      unselectAuto: false,
    };
  };

  getEvents = () => {
    const { resource } = this.props;
    const { selected } = this.state;

    const getClassNames = (reservation) => {
      return classNames('app-ResourceReservationCalendar__event', {
        'app-ResourceReservationCalendar__event--reserved': !reservation.is_own,
      });
    };

    const events = get(resource, 'reservations', []).map(reservation => ({
      classNames: [getClassNames(reservation)],
      editable: false,
      id: reservation.id,
      start: moment(reservation.begin).toDate(),
      end: moment(reservation.end).toDate(),
    }));

    if (selected) {
      events.push({
        classNames: ['app-ResourceReservationCalendar__event', 'app-ResourceReservationCalendar__newReservation'],
        editable: true,
        id: 'newReservation',
        ...selected,
      });
    }

    return events;
  };

  getSlotLabelInterval = () => {
    const { resource } = this.props;

    if (resource.slot_size === '00:15:00') {
      return '00:30:00';
    }

    return '01:00:00';
  };

  onDatesRender = (info) => {
    const {
      date,
      onDateChange,
    } = this.props;

    const momentDate = moment(date);
    const activeStart = moment(info.view.activeStart);
    const activeEnd = moment(info.view.activeEnd);

    if (momentDate.isBefore(activeStart, 'day') || momentDate.isAfter(activeEnd, 'day')) {
      onDateChange(activeStart.format(constants.DATE_FORMAT));
    }

    const {
      view,
    } = this.state;

    if (view !== info.view.type) {
      this.setState({
        view: info.view.type,
      });
    }
  };

  onSelect = (selectionInfo) => {
    this.setState({
      selected: {
        start: selectionInfo.start,
        end: selectionInfo.end,
      },
    });

    // Hide the FullCalendar selection widget/indicator.
    const calendarApi = this.calendarRef.current.getApi();
    calendarApi.unselect();
  };

  onSelectAllow = (selectInfo) => {
    const now = moment();
    const start = moment(selectInfo.start);

    // Prevent selecting times from past.
    return start.isAfter(now);
  };

  onEventDrop = (eventDropInfo) => {
    const { event } = eventDropInfo;
    this.setState({
      selected: {
        start: event.start,
        end: event.end,
      },
    });
  };

  onEventResize = (eventResizeInfo) => {
    const { event } = eventResizeInfo;
    this.setState({
      selected: {
        start: event.start,
        end: event.end,
      },
    });
  };

  onReserveButtonClick = () => {

  };

  getDurationText = () => {
    const { selected } = this.state;
    const start = moment(selected.start);
    const end = moment(selected.end);
    const duration = moment.duration(end.diff(start));
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    let text = '';
    if (days) {
      text = `${days}d`;
    }

    if (hours) {
      text += `${hours}h`;
    }

    if (minutes) {
      text += `${minutes}min`;
    }

    return text;
  };

  getSelectedDateText = () => {
    const { t } = this.props;
    const { selected } = this.state;

    if (selected) {
      const start = moment(selected.start);
      const end = moment(selected.end);

      return t('ResourceReservationCalendar.selectedDateValue', {
        date: start.format('dd D.M.Y'),
        start: start.format('HH:mm'),
        end: end.format('HH:mm'),
        duration: this.getDurationText(),
      });
    }

    return '';
  };

  render() {
    const {
      date,
      resource,
      t,
    } = this.props;

    const {
      view,
      selected,
    } = this.state;

    return (
      <div className="app-ResourceReservationCalendar">
        <Row>
          <Col xs={12}>
            <FullCalendar
              allDaySlot={false}
              businessHours={resourceUtils.getFullCalendarBusinessHours(resource, date)}
              datesRender={this.onDatesRender}
              defaultDate={date}
              eventDrop={this.onEventDrop}
              eventResize={this.onEventResize}
              events={this.getEvents()}
              ref={this.calendarRef}
              select={this.onSelect}
              selectAllow={this.onSelectAllow}
              slotLabelInterval={this.getSlotLabelInterval()}
              {...this.getCalendarOptions()}
              maxTime={resourceUtils.getFullCalendarMaxTime(resource, date, view)}
              minTime={resourceUtils.getFullCalendarMinTime(resource, date, view)}
            />
          </Col>
        </Row>
        {selected && (
          <div className="app-ResourceReservationCalendar__selectedInfo">
            <Row>
              <Col xs={8}>
                <strong className="app-ResourceReservationCalendar__selectedDateLabel">
                  {t('ResourceReservationCalendar.selectedDateLabel')}
                </strong>
                {' '}
                <span className="app-ResourceReservationCalendar__selectedDateValue">
                  {this.getSelectedDateText()}
                </span>
              </Col>
              <Col xs={4}>
                <Button
                  bsStyle="primary"
                  className="app-ResourceReservationCalendar__reserveButton"
                  onClick={() => this.onReserveButtonClick()}
                >
                  {t('ResourceReservationCalendar.reserveButton')}
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  }
}

export default injectT(injectIntl(ResourceReservationCalendar));
