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

-- 1. Usuarios (Administradores, Profesores, Padres)
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(191) UNIQUE NOT NULL,
    cdl VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(191) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    role ENUM('admin', 'profesor', 'usuario') NOT NULL, 
    is_active BOOLEAN DEFAULT TRUE
);


-- 2. Cursos (Aquí se asigna el Profesor/Tutor directamente)
CREATE TABLE courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(255) NOT NULL,
    section VARCHAR(50),
    educational_level VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    professor_id BIGINT UNIQUE NULL, -- El tutor del curso (Opcional y único)
    CONSTRAINT fk_course_tutor FOREIGN KEY (professor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Estudiantes
CREATE TABLE students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    cdl VARCHAR(20) UNIQUE NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(191) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    nfc_uid VARCHAR(50) UNIQUE, 
    is_active BOOLEAN DEFAULT TRUE,
    course_id BIGINT,
    CONSTRAINT fk_student_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- 4. Parentescos (Padres <-> Estudiantes)

CREATE TABLE relationships (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT,
    student_id BIGINT,
    CONSTRAINT fk_rel_parent FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_rel_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 5. Asistencias
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

-- 6. Resumen de Estudiantes (Puntos y Asistencias totales)
CREATE TABLE student_summaries (
    student_id BIGINT PRIMARY KEY,
    total_attendances INTEGER DEFAULT 0,
    total_absences INTEGER DEFAULT 0,
    current_points INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    CONSTRAINT fk_summary_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 7. Resumen Diario por Curso
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

-- 8. Transacciones de Puntos
CREATE TABLE point_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    points INTEGER,
    concept TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_points_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);


--niveles educativos dinamicos 

CREATE TABLE education_levels (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL, -- Ej: "Bachillerato Técnico"
    section ENUM('mañana', 'tarde', 'noche') NOT NULL,
    entry_time TIME NOT NULL,   -- Ej: 07:00:00
    exit_time TIME NOT NULL,    -- Ej: 13:00:00
    tolerance_minutes INT DEFAULT 15 -- Gracia antes de marcar "Tarde"
);


mejora visual 


CREATE TABLE education_levels (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL, -- Ej: Bachillerato Técnico
    section ENUM('mañana', 'tarde', 'noche') NOT NULL,
    entry_time TIME NOT NULL,    -- Ej: 07:00:00
    exit_time TIME NOT NULL,     -- Ej: 13:30:00
    tolerance_minutes INT DEFAULT 15, -- Gracia para la entrada
    early_exit_limit TIME DEFAULT NULL, -- Hora mínima para salir sin permiso especial
    color_hex CHAR(7) DEFAULT '#3b82f6'
);


--dias laborables y dias especiales 

CREATE TABLE weekly_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    level_id BIGINT,
    day_of_week ENUM('Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'),
    is_working_day BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_schedule_level FOREIGN KEY (level_id) REFERENCES education_levels(id)
);

-calendario de eventos 


CREATE TABLE calendar_event (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    color_hex CHAR(7) DEFAULT '#3b82f6',
    
    -- Tipo de evento: 
    -- 'feriado' (no hay asistencia)
    -- 'horario_especial' (hay asistencia pero cambia la hora)
    -- 'evento_social' (informativo, horario normal)
    event_type ENUM('feriado', 'horario_especial', 'evento_social') DEFAULT 'evento_social',
    
    -- Si es NULL afecta a todos. Si tiene ID afecta solo a ese nivel.
    education_level_id BIGINT NULL,
    
    -- Horas personalizadas (se usan solo si event_type = 'horario_especial')
    custom_entry_time TIME NULL,
    custom_exit_time TIME NULL,
    
    CONSTRAINT fk_event_level FOREIGN KEY (education_level_id) 
        REFERENCES education_levels(id) ON DELETE CASCADE
);


-- Si el evento no es para todos, aquí defines a quién afecta
CREATE TABLE event_scope (
    event_id BIGINT,
    course_id BIGINT, -- O level_id, según prefieras
    FOREIGN KEY (event_id) REFERENCES calendar_events(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
