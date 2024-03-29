import React, { useState, useEffect } from 'react';
import './courses.css';
import Axios from 'axios';
import StudentsCourseCard from '../components/Courses/StudentsCourseCard';

function StudentsCourses() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [courseCards, setCourseCards] = useState([]);
  const [courseCycle, setCourseCycle] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [courses, setCourses] = useState([]);
  const [enroll, setEnroll] = useState(false);

  const handleEnroll = () => {
    setEnroll((preV) => !preV);
  };

  useEffect(() => {
    Axios.get(`${API_URL}/courses/get`).then(
      (response) => {
        if (response.data) {
          console.log(response);
          setCourses(response.data.data);
        } else {
          console.log('Response data is not an array:', response.data);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }, [enroll]);

  useEffect(() => {
    Axios.get(`${API_URL}/courseCycle/get`).then(
      (response) => {
        console.log(response.data.data);
        if (response.data) {
          setCourseCycle(response.data.data);
        } else {
          console.log('Response data is not an array:', response.data);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }, [enroll]);

  useEffect(() => {
    Axios.get(`${API_URL}/enrollment/get`).then(
      (response) => {
        console.log(response.data.message);
        if (response.data) {
          setEnrollments(response.data.message);
        } else {
          console.log('Response data is not an array:', response.data);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }, [enroll]);

  const brom = courses.map((item) => {
    const filteredCycle = courseCycle.filter(
      (cycle) => cycle.courseID === item.id
    );
    const filterdEnrollments = enrollments.filter(
      (enrollment) => enrollment.courseCycleID === filteredCycle[0]?.id
    );
    const mkansal = filterdEnrollments.map(
      (enrollment) => enrollment.cancelled
    );
    const enrolled = filterdEnrollments.map(
      (enrollment) => enrollment.enrolled
    );
    console.log('mkansal', mkansal);
    const dateInputs = filteredCycle.map((cycle, index) => (
      <div
        key={`{cycle.courseID}-${index}`}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start ',
          fontSize: '1.2rem',
          justifyContent: 'space-around',
        }}
      >
        <h3>{cycle.startDate}</h3>
        <h3>{cycle.endDate}</h3>
      </div>
    ));

    let endDate;
    let startDate;
    let currentDate;
    if (filteredCycle.length > 0 && filteredCycle[0]) {
      const cycle = filteredCycle[0];
      startDate = new Date(cycle.startDate);
      endDate = new Date(cycle.endDate);
      currentDate = new Date();
    }

    return (
      dateInputs.length > 0 &&
      startDate > currentDate &&
      endDate > currentDate && (
        <StudentsCourseCard
          key={item.id}
          courseID={item.id}
          title={item.title}
          description={item.description}
          durationByDays={item.durationByDays}
          dates={dateInputs}
          cycle={filteredCycle}
          cancelled={mkansal.length > 0 ? mkansal : ['N/A']}
          enrolled={enrolled}
          enrollments={filterdEnrollments}
          onEnroll={handleEnroll}
        />
      )
    );
  });

  return (
    <>
      <div className="course-card">{brom}</div>
    </>
  );
}

export default StudentsCourses;
