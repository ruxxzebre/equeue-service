import { formatDatesHHMM } from "./helpers";

export const sendToAPI = async (evv, url) => {
  const ap = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(evv)
  });
  return await ap.json();

}

export const sendEventToAPI = (evv) => {
  return sendToAPI(evv, 'http://localhost:3000/api/bookmeet');
};

export const submitConfiguration = async () => {

};

export const submitEventBooking = async (result, hhmmLabel, refreshData) => {
  if (result.isConfirmed) {
    if (validate(result.value)) {

      await sendEventToAPI({
        name: result.value[0],
        phone: result.value[1],
        created_at: Date.now(),
        date: formatDatesHHMM(date, hhmmLabel.split(':')[0], hhmmLabel.split(':')[1])
      }).then(res => {
        if (!res.error) {
          recordDispatch(
            {
              data:
                {
                  name: result.value[0],
                  phone: result.value[1],
                  date: formatDatesHHMM(date, hhmmLabel.split(':')[0], hhmmLabel.split(':')[1])
                },
              type: 'addRecord'
            }
          );
          const currentDate = formatDatesHHMM(date, hhmmLabel.split(':')[0], hhmmLabel.split(':')[1], true);
          swal.fire({
            title: `Вас успішно зареєстровано. Приходь о ${
              currentDate.format('HH:mm').toString()
            } ${
              currentDate
                .format('DD.MM.YYYY')
                .toString()
            }`}).then(refreshData);
        } else {
          return swal.fire({
            title: 'Дані введено некорректно',
            text: res.error
          });
        }
      });
      return;
    }
    return swal.fire({
      title: 'Дані введено некорректно'
    });
  }
}
