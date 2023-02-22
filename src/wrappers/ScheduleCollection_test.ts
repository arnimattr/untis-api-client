import { assert } from "../../deps.ts";
import { lesson } from "../webuntis/resources/mod.ts";
import { Lesson, Time, Timetable } from "../../mod.ts";

Deno.test("ScheduleCollection.combineSequentialSchedules()", () => {
  const lessons: lesson[] = [];

  // The first two lessons can be combined
  lessons[0] = {
    activityType: "",
    date: 20230101,
    startTime: 1000,
    endTime: 1100,
    id: 1,
    lsnumber: 1,
    kl: [],
    lstext: "",
    ro: [],
    su: [],
    te: [],
    code: "",
  };
  lessons[1] = { ...lessons[0]!, startTime: 1100, endTime: 1200, id: 2 };

  // The next two have different elements
  lessons[2] = { ...lessons[0]!, date: 20230108, id: 3 };
  lessons[3] = {
    ...lessons[2]!,
    startTime: 1100,
    endTime: 1200,
    id: 4,
    te: [{ id: 5, name: "" }],
  };

  const { schedules } = new Timetable(lessons.map(Lesson.from))
    .getScheduleCollection()
    .combineSequentialSchedules();

  assert(schedules.length === 1, "All lessons should be added to one schedule");

  const schedule = schedules[0]!;

  assert(
    schedule.lessons.unchanged.length === 1,
    "The first two lessons should have been combined into one longer lesson",
  );

  assert(
    schedule.lessons.unchanged[0]!.startTime.equals(schedule.startTime) &&
      schedule.lessons.unchanged[0]!.endTime.equals(schedule.endTime),
    "The start and end time of the combined lesson should match the schedule",
  );

  assert(
    schedule.lessons.changed.length === 2,
    "Two lessons should not have been combined",
  );

  assert(
    [[0, 1], [1, 0]].some((values) => {
      let [i, j] = values as [number, number];
      return schedule.lessons.changed[i]!.startTime.equals(new Time(10, 0)) &&
        schedule.lessons.changed[i]!.endTime.equals(new Time(11, 0)) &&
        schedule.lessons.changed[j]!.startTime.equals(new Time(11, 0)) &&
        schedule.lessons.changed[j]!.endTime.equals(new Time(12, 0));
    }),
    "The start and end times of the last two lessons should not change",
  );
});
