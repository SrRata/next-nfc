This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 01-03-2026

El componente button, select, observation, table no han sido aprobados totalmente, posiblemente tengan cambios.

El componente table tooltip debe ser revisado

en un futuro podria el componete user tener un menu desplegable conmas opciones sobre el usuario

ui de layout de dashboard esta finalizada (si el tiempo alcanza se debe agregar el bot asistente)
ui de pagina principal de dashboard esta finalizada
ui de pagina cursos de dashboard esta finalizada


## DATABASE STRUCTURE 

-- 1. Table: courses
CREATE TABLE courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(255) NOT NULL,
    parallel VARCHAR(50),
    section VARCHAR(50),
    educational_level VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Table: users (Professors, Admins, Parents)
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(191) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(191) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(50) NOT NULL
);

-- 3. Table: students
CREATE TABLE students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(191) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    nfc_uid VARCHAR(50) UNIQUE, 
    is_active BOOLEAN DEFAULT TRUE,
    course_id BIGINT,
    CONSTRAINT fk_student_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- 4. Table: subjects (Materias)
CREATE TABLE subjects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(255) NOT NULL
);

-- 5. Table: assignments (Asignaciones)
CREATE TABLE assignments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    professor_id BIGINT,
    subject_id BIGINT,
    course_id BIGINT,
    CONSTRAINT fk_assign_professor FOREIGN KEY (professor_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_assign_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_assign_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 6. Table: relationships (Parentescos)
CREATE TABLE relationships (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT,
    student_id BIGINT,
    CONSTRAINT fk_rel_parent FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_rel_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 7. Table: attendance_records (Registros)
CREATE TABLE attendance_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    event VARCHAR(255) NOT NULL,
    student_id BIGINT,
    entry_time TIME,
    exit_time TIME,
    observation TEXT,
    CONSTRAINT fk_record_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 8. Table: student_summaries (Resumen Estudiante)
CREATE TABLE student_summaries (
    student_id BIGINT PRIMARY KEY,
    total_attendances INTEGER DEFAULT 0,
    total_absences INTEGER DEFAULT 0,
    current_points INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    CONSTRAINT fk_summary_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 9. Table: daily_course_summaries (Resumen Diario Cursos)
CREATE TABLE daily_course_summaries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    course_id BIGINT NOT NULL,
    section VARCHAR(50) NOT NULL,
    total_present INTEGER DEFAULT 0,
    total_absent INTEGER DEFAULT 0,
    total_late INTEGER DEFAULT 0,
    CONSTRAINT fk_daily_summary_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 10. Table: point_transactions (Transacción Puntos)
CREATE TABLE point_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    points INTEGER,
    concept TEXT,
    date DATE,
    CONSTRAINT fk_points_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
