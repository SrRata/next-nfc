## DATABASE STRUCTURE 

-- 1. Niveles educativos
CREATE TABLE educational_levels (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Secciones
CREATE TABLE sections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Horarios
CREATE TABLE schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    educational_level_id BIGINT NOT NULL,
    section_id BIGINT NOT NULL,
    entry_time TIME NOT NULL,
    exit_time TIME NOT NULL,
    entry_tolerance INT DEFAULT 10,
    exit_tolerance INT DEFAULT 20,
    UNIQUE KEY uq_schedule (educational_level_id, section_id),
    CONSTRAINT fk_schedule_level   FOREIGN KEY (educational_level_id) REFERENCES educational_levels(id) ON DELETE RESTRICT,
    CONSTRAINT fk_schedule_section FOREIGN KEY (section_id)           REFERENCES sections(id) ON DELETE RESTRICT
);

-- 4. Usuarios
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

-- 5. Cursos (section y educational_level ahora son FKs)
CREATE TABLE courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(255) NOT NULL,
    section_id BIGINT NOT NULL,
    educational_level_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    professor_id BIGINT UNIQUE NULL,
    CONSTRAINT fk_course_section   FOREIGN KEY (section_id)           REFERENCES sections(id) ON DELETE RESTRICT,
    CONSTRAINT fk_course_level     FOREIGN KEY (educational_level_id) REFERENCES educational_levels(id) ON DELETE RESTRICT,
    CONSTRAINT fk_course_professor FOREIGN KEY (professor_id)         REFERENCES users(id) ON DELETE SET NULL
);

-- 6. Estudiantes
CREATE TABLE students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    cdl VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(191) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    nfc_uid VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    course_id BIGINT,
    CONSTRAINT fk_student_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- 7. Parentescos
CREATE TABLE relationships (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT,
    student_id BIGINT,
    CONSTRAINT fk_rel_parent  FOREIGN KEY (parent_id)  REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_rel_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 8. Asistencias
CREATE TABLE attendance_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    student_id BIGINT,
    entry_time TIME,
    exit_time TIME,
    observation TEXT,
    CONSTRAINT fk_record_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 9. Resumen por estudiante
CREATE TABLE student_summaries (
    student_id BIGINT PRIMARY KEY,
    total_attendances INTEGER DEFAULT 0,
    total_absences INTEGER DEFAULT 0,
    CONSTRAINT fk_summary_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 10. Resumen diario por curso (section_id en lugar de VARCHAR)
CREATE TABLE daily_course_summaries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    course_id BIGINT NOT NULL,
    section_id BIGINT NOT NULL,
    total_present INTEGER DEFAULT 0,
    total_absent INTEGER DEFAULT 0,
    total_late INTEGER DEFAULT 0,
    UNIQUE KEY uq_daily_summary (date, course_id),
    CONSTRAINT fk_daily_course   FOREIGN KEY (course_id)  REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_daily_section  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE RESTRICT
);

CREATE TABLE working_days (
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    date       DATE UNIQUE NOT NULL,
    reason     VARCHAR(255) NOT NULL,  -- requerido: siempre debe explicarse por qué es feriado
    created_by BIGINT,
    CONSTRAINT fk_wd_user FOREIGN KEY (created_by)
      REFERENCES users(id) ON DELETE SET NULL
);


CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('entry', 'exit', 'absence') NOT NULL,
    student_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_student FOREIGN KEY (student_id)
      REFERENCES students(id) ON DELETE CASCADE
);

-- A quién va dirigida cada notificación
CREATE TABLE notification_recipients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    notification_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_nr_notification FOREIGN KEY (notification_id)
      REFERENCES notifications(id) ON DELETE CASCADE,
    CONSTRAINT fk_nr_user FOREIGN KEY (user_id)
      REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_notif_user (notification_id, user_id)
);


CREATE TABLE special_day_schedules (
    id                   BIGINT PRIMARY KEY AUTO_INCREMENT,
    date                 DATE NOT NULL,
    -- Alcance: NULL = aplica a todos, valor = solo ese
    section_id           BIGINT NULL,
    educational_level_id BIGINT NULL,
    -- Horario modificado
    entry_time           TIME NOT NULL,
    exit_time            TIME NOT NULL,
    entry_tolerance      INT DEFAULT 10,
    exit_tolerance       INT DEFAULT 20,
    reason               VARCHAR(255) NOT NULL,
    created_by           BIGINT NULL,
    created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sds_section FOREIGN KEY (section_id)
      REFERENCES sections(id) ON DELETE CASCADE,
    CONSTRAINT fk_sds_level FOREIGN KEY (educational_level_id)
      REFERENCES educational_levels(id) ON DELETE CASCADE,
    CONSTRAINT fk_sds_user FOREIGN KEY (created_by)
      REFERENCES users(id) ON DELETE SET NULL,
    -- No puede haber dos registros para la misma combinación fecha+sección+nivel
    UNIQUE KEY uq_sds (date, section_id, educational_level_id)
);





CREATE TABLE user_invites (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

1. educational_levels   → sin dependencias
2. sections             → sin dependencias
3. schedules            → depende de 1 y 2
4. users                → sin dependencias
5. courses              → depende de 1, 2 y 4
6. students             → depende de 5
7. relationships        → depende de 4 y 6
8. student_summaries    → depende de 6


Datos de prueba para probar funcionalidad de registro de asistencia.

-- 1. Niveles educativos
INSERT INTO educational_levels (name, is_active) VALUES
('Educación Básica', TRUE),
('Bachillerato', TRUE);

-- 2. Secciones
INSERT INTO sections (name, is_active) VALUES
('Matutina', TRUE),
('Vespertina', TRUE);

-- 3. Horarios
-- Matutina de Básica: entrada 7:30, salida 13:00
-- Vespertina de Bachillerato: entrada 13:30, salida 18:00
INSERT INTO schedules 
  (educational_level_id, section_id, entry_time, exit_time, entry_tolerance, exit_tolerance) 
VALUES
(1, 1, '07:30:00', '13:00:00', 10, 20),  -- Básica Matutina
(2, 2, '13:30:00', '18:00:00', 10, 20);  -- Bachillerato Vespertina

-- 4. Usuarios (un profesor y un padre)
INSERT INTO users 
  (first_name, last_name, username, cdl, password, email, phone_number, role) 
VALUES
('Carlos', 'Pérez', 'cperez', '0101010101', '123456', 'cperez@mail.com', '0991234567', 'profesor'),
('María', 'Gómez', 'mgomez', '0202020202', '123456', 'mgomez@mail.com', '0997654321', 'usuario');

-- 5. Cursos
INSERT INTO courses 
  (course_name, section_id, educational_level_id, is_active, professor_id) 
VALUES
('8vo A', 1, 1, TRUE, 1),   -- Básica Matutina, profesor Carlos
('1ro BGU B', 2, 2, TRUE, NULL); -- Bachillerato Vespertina, sin tutor

-- 6. Estudiantes
INSERT INTO students 
  (first_name, last_name, cdl, email, phone_number, nfc_uid, is_active, course_id) 
VALUES
('Juan', 'Torres',  '0301010101', 'jtorres@mail.com',  '0981111111', 'NFC-AA-001', TRUE, 1),
('Ana',  'Salinas', '0302020202', 'asalinas@mail.com', '0982222222', 'NFC-BB-002', TRUE, 1),
('Luis', 'Mora',    '0303030303', 'lmora@mail.com',    '0983333333', 'NFC-CC-003', TRUE, 2);

-- 7. Parentesco (María es madre de Juan)
INSERT INTO relationships (parent_id, student_id) VALUES (2, 1);

-- 8. Resúmenes iniciales
INSERT INTO student_summaries (student_id, total_attendances, total_absences) VALUES
(1, 0, 0),
(2, 0, 0),
(3, 0, 0);



body appi de entrada y salida 

{
  "student_id": 1,
}

o

{
  "nfc_uid": "NFC-BB-002",
}

para pruebas reemplazar getCurrentTimeString() por esto durante pruebas:

const currentTime = body.mock_time ?? getCurrentTimeString();

y hacer las agregar el mock_time al body

{
  "mock_time": "13:05:00"
}

ademas hay un endpoint para borrar los datos de hoy 

api/attendance/reset-attendance

y hay tro endo porin que ejecula el job para registrar las ausencias. por defencto se jecuta a las 23:29:00 de cada dia 

api/dev/reset-attendance





Crud niveles educativos, horarios y secciones 

MétodoEndpointAcciónGET/api/educational-levelsListar niveles activosGET/api/educational-levels?active=falseListar todosPOST/api/educational-levelsCrear nivelGET/api/educational-levels/:idDetallePUT/api/educational-levels/:idEditarDELETE/api/educational-levels/:idDesactivarGET/api/sectionsListar secciones activasPOST/api/sectionsCrear secciónPUT/api/sections/:idEditarDELETE/api/sections/:idDesactivarGET/api/schedulesListar con nombresPOST/api/schedulesCrear horarioGET/api/schedules/:idDetalle con nombresPUT/api/schedules/:idEditarDELETE/api/schedules/:idEliminar físico











Body de ejemplo para crear estudiante

{
  "first_name": "Pedro",
  "last_name": "Ríos",
  "cdl": "0304040404",
  "email": "prios@mail.com",
  "nfc_uid": "NFC-DD-004",
  "course_id": 1
}

Estudiante + representante nuevo:

{
  "first_name": "Pedro",
  "last_name": "Ríos",
  "cdl": "0304040404",
  "email": "prios@mail.com",
  "nfc_uid": "NFC-DD-004",
  "course_id": 1,
  "parent": {
    "first_name": "Roberto",
    "last_name": "Ríos",
    "cdl": "0404040404",
    "email": "rrios@mail.com",
    "username": "rrios",
    "password": "hashedPassword123",
    "phone_number": "0994444444"
  }
}


Estudiante + representante que ya existe en el sistema:


{
  "first_name": "Sofía",
  "last_name": "Ríos",
  "cdl": "0305050505",
  "email": "srios@mail.com",
  "course_id": 2,
  "parent": {
    "cdl": "0404040404",
    "first_name": "",
    "last_name": "",
    "email": "",
    "username": "",
    "password": ""
  }
}





MétodoEndpointAcciónGET/api/coursesListar cursos activosPOST/api/coursesCrear cursoGET/api/courses/:idDetalle del cursoPUT/api/courses/:idEditar cursoDELETE/api/courses/:idDesactivar cursoGET/api/courses/:id/studentsEstudiantes del cursoGET/api/studentsListar estudiantes activosPOST/api/studentsCrear estudiante + representanteGET/api/students/:idDetalle del estudiantePUT/api/students/:idEditar + asignar representanteDELETE/api/students/:idDesactivar estudiante

















































# GUÍA COMPLETA DE PRUEBAS — POSTMAN
## Sistema de Asistencia Escolar

---

## CONFIGURACIÓN INICIAL

### Variables de entorno en Postman
Crea un Environment llamado "Asistencia Dev" con estas variables:

```
BASE_URL    = http://localhost:3000
STUDENT_ID  = (se llena después de crear estudiante)
NFC_UID     = NFC-AA-001
COURSE_ID   = (se llena después de crear curso)
USER_ID     = (se llena después de crear usuario)
```

### Cómo guardar IDs automáticamente
En la pestaña "Tests" de cada POST de creación, agrega:
```javascript
const data = pm.response.json();
if (data.data?.id) {
    pm.environment.set("STUDENT_ID", data.data.id);
}
```

---

## SOLUCIÓN AL PROBLEMA DE DÍAS Y HORARIOS

El sistema solo permite registrar asistencia lunes a viernes (días laborables).
Si hoy es sábado, domingo, o feriado → obtendrás 422 en entry/exit.

### Estrategia para probar CUALQUIER día

**Opción A — mock_time (recomendada para horas)**
El campo `mock_time` simula la hora pero NO el día de la semana.
Solo funciona si `NODE_ENV=development`.

```json
{
  "student_id": 1,
  "mock_time": "07:25:00"
}
```

**Opción B — Sobreescribir isWorkingDay temporalmente**
En `lib/attendance/working-days.helper.ts`, comenta la validación de fin de semana:

```typescript
// Para testing — descomentar solo en desarrollo
export async function isWorkingDay(date: string): Promise<boolean> {
  // const dow = new Date(date).getUTCDay();
  // if (dow === 0 || dow === 6) return false; // ← comentar esto
  const [rows]: any = await pool.query(
    `SELECT id FROM working_days WHERE date = ?`, [date]
  );
  return rows.length === 0;
}
```

**Opción C — Endpoint de override para tests (solo development)**
Agrega esto a `app/api/dev/force-entry/route.ts`:

```typescript
// app/api/dev/force-entry/route.ts
// Este endpoint bypasea la validación de día laborable para pruebas
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentDateString, getCurrentTimeString, checkEntryStatus } from "@/lib/attendance/time.helper";
import { resolveSchedule } from "@/lib/attendance/schedule.helper";
import { createAndSendNotification } from "@/lib/notifications/notify";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No disponible en producción" }, { status: 403 });
  }
  // Igual que entry/route.ts pero sin isWorkingDay()
  // ... misma lógica
}
```

**Opción D — Cambiar la fecha en getCurrentDateString() temporalmente**
```typescript
// En time.helper.ts, cambiar temporalmente para probar un lunes específico:
export function getCurrentDateString(): string {
  return "2025-05-12"; // lunes fijo para pruebas
  // return new Date().toLocaleDateString("en-CA", { timeZone: "America/Guayaquil" });
}
```

> **RECOMENDACIÓN:** Usa la Opción B para pruebas de fin de semana.
> Usa mock_time siempre para simular horas. Revierte antes de producción.

---

## COLECCIÓN COMPLETA DE PRUEBAS

Organizada en el orden exacto que debes ejecutar (hay dependencias entre ellas).

---

# 📁 MÓDULO 1 — AUTENTICACIÓN

## 1.1 Login exitoso con email
```
Método:  POST
URL:     {{BASE_URL}}/api/auth/login
Headers: Content-Type: application/json
Body:
{
  "user": "admin@colegio.com",
  "password": "admin123"
}

✅ Esperado 200:
{
  "message": "Login exitoso"
}
+ Cookie: miTokenName=eyJ... (httpOnly)

📝 Verificar: En Cookies de Postman debe aparecer "miTokenName"
```

## 1.2 Login exitoso con username
```
Método:  POST
URL:     {{BASE_URL}}/api/auth/login
Body:
{
  "user": "admin",
  "password": "admin123"
}

✅ Esperado 200: { "message": "Login exitoso" }
```

## 1.3 Login con credenciales inválidas
```
Body:
{
  "user": "admin@colegio.com",
  "password": "passwordMal"
}

❌ Esperado 401:
{ "error": "Credenciales inválidas" }
```

## 1.4 Login sin campos
```
Body: {}

❌ Esperado 400:
{ "error": "Usuario y contraseña requeridos" }
```

## 1.5 Login usuario inactivo
```
Primero desactiva un usuario:
  PUT {{BASE_URL}}/api/users/3 con is_active: false

Luego:
Body:
{
  "user": "mgomez",
  "password": "123456"
}

❌ Esperado 401: { "error": "Credenciales inválidas" }
```

## 1.6 Obtener sesión activa (me)
```
Método:  GET
URL:     {{BASE_URL}}/api/auth/me
(La cookie se envía automáticamente)

✅ Esperado 200:
{
  "success": true,
  "data": {
    "id": 1,
    "role": "admin",
    "firstName": "Admin",
    "lastName": "Sistema",
    "username": "admin",
    "email": "admin@colegio.com"
  }
}
```

## 1.7 Me sin sesión activa
```
Elimina la cookie manualmente en Postman, luego:
GET {{BASE_URL}}/api/auth/me

❌ Esperado 401: { "error": "No autenticado" }
```

## 1.8 Logout
```
Método:  POST
URL:     {{BASE_URL}}/api/auth/logout
Body:    {}

✅ Esperado 200: { "message": "Logout exitoso" }
📝 Verificar: La cookie miTokenName debe desaparecer o expirar
```

---

# 📁 MÓDULO 2 — NIVELES EDUCATIVOS

> Asegúrate de estar logueado como admin antes de estas pruebas.

## 2.1 Crear nivel educativo
```
Método:  POST
URL:     {{BASE_URL}}/api/educational-levels
Body:
{
  "name": "Educación Básica"
}

✅ Esperado 201:
{
  "success": true,
  "message": "Nivel educativo creado correctamente",
  "data": { "id": 1, "name": "Educación Básica", "is_active": true }
}
```

## 2.2 Crear segundo nivel
```
Body: { "name": "Bachillerato" }
✅ Esperado 201: id: 2
```

## 2.3 Crear nivel duplicado
```
Body: { "name": "Educación Básica" }
❌ Esperado 409: { "error": "Ya existe un nivel educativo con ese nombre" }
```

## 2.4 Crear nivel sin nombre
```
Body: { "name": "" }
❌ Esperado 400: { "error": "El campo 'name' es requerido" }
```

## 2.5 Listar niveles activos
```
Método: GET
URL:    {{BASE_URL}}/api/educational-levels

✅ Esperado 200:
{
  "success": true,
  "data": [
    { "id": 1, "name": "Bachillerato", "is_active": true },
    { "id": 2, "name": "Educación Básica", "is_active": true }
  ]
}
📝 Nota: Ordenados por nombre ASC
```

## 2.6 Listar todos (incluyendo inactivos)
```
URL: {{BASE_URL}}/api/educational-levels?active=false
✅ Esperado 200: incluye registros con is_active: false
```

## 2.7 Obtener nivel por ID
```
Método: GET
URL:    {{BASE_URL}}/api/educational-levels/1
✅ Esperado 200: datos del nivel 1
```

## 2.8 Obtener nivel inexistente
```
URL: {{BASE_URL}}/api/educational-levels/9999
❌ Esperado 404: { "error": "Nivel educativo no encontrado" }
```

## 2.9 Editar nivel
```
Método: PUT
URL:    {{BASE_URL}}/api/educational-levels/1
Body:
{
  "name": "Educación Básica Media",
  "is_active": true
}
✅ Esperado 200: actualizado correctamente
```

## 2.10 Desactivar nivel (soft delete)
```
Método: DELETE
URL:    {{BASE_URL}}/api/educational-levels/1

✅ Esperado 200: { "message": "Nivel educativo desactivado correctamente" }
📝 Verificar: GET /api/educational-levels ya no muestra el nivel 1
             GET /api/educational-levels?active=false sí lo muestra
```

## 2.11 Desactivar nivel ya desactivado
```
DELETE {{BASE_URL}}/api/educational-levels/1 (de nuevo)
❌ Esperado 409: { "error": "El nivel educativo ya está desactivado" }
```

## 2.12 Desactivar nivel con cursos asociados
```
(Primero crea un curso con educational_level_id: 2, luego:)
DELETE {{BASE_URL}}/api/educational-levels/2

❌ Esperado 409 o error FK:
{ "error": "No se puede eliminar: tiene datos asociados" }
```

> ⚠️ Reactiva el nivel 1 antes de continuar:
> PUT /api/educational-levels/1 con { "name": "Educación Básica", "is_active": true }

---

# 📁 MÓDULO 3 — SECCIONES

## 3.1 Crear sección Matutina
```
Método: POST
URL:    {{BASE_URL}}/api/sections
Body:   { "name": "Matutina" }
✅ Esperado 201: id: 1
```

## 3.2 Crear sección Vespertina
```
Body: { "name": "Vespertina" }
✅ Esperado 201: id: 2
```

## 3.3 Crear sección Nocturna
```
Body: { "name": "Nocturna" }
✅ Esperado 201: id: 3
```

## 3.4 Sección duplicada
```
Body: { "name": "Matutina" }
❌ Esperado 409: { "error": "Ya existe una sección con ese nombre" }
```

## 3.5 Listar secciones
```
GET {{BASE_URL}}/api/sections
✅ Esperado 200: array con las 3 secciones
```

## 3.6 Editar sección
```
PUT {{BASE_URL}}/api/sections/3
Body: { "name": "Nocturna", "is_active": false }
✅ Esperado 200: actualizada (desactivada)
```

## 3.7 Desactivar sección
```
DELETE {{BASE_URL}}/api/sections/3
✅ o ❌ 409 si ya estaba desactivada por el paso anterior
```

---

# 📁 MÓDULO 4 — HORARIOS BASE

## 4.1 Crear horario Básica Matutina
```
Método: POST
URL:    {{BASE_URL}}/api/schedules
Body:
{
  "educational_level_id": 1,
  "section_id": 1,
  "entry_time": "07:30:00",
  "exit_time": "13:00:00",
  "entry_tolerance": 10,
  "exit_tolerance": 20
}
✅ Esperado 201: horario creado
```

## 4.2 Crear horario Bachillerato Vespertina
```
Body:
{
  "educational_level_id": 2,
  "section_id": 2,
  "entry_time": "13:30:00",
  "exit_time": "18:00:00",
  "entry_tolerance": 10,
  "exit_tolerance": 20
}
✅ Esperado 201
```

## 4.3 Horario duplicado (mismo nivel + sección)
```
Body: (mismo que 4.1)
❌ Esperado 409: { "error": "Ya existe un horario para ese nivel y sección" }
```

## 4.4 Horario con entrada >= salida
```
Body:
{
  "educational_level_id": 1,
  "section_id": 2,
  "entry_time": "13:00:00",
  "exit_time": "07:00:00"
}
❌ Esperado 400: { "error": "La hora de entrada debe ser menor a la hora de salida" }
```

## 4.5 Formato de hora inválido
```
Body:
{
  "educational_level_id": 1,
  "section_id": 2,
  "entry_time": "7:30",
  "exit_time": "13:00:00"
}
❌ Esperado 400: { "error": "El formato de hora debe ser HH:MM:SS" }
```

## 4.6 Listar horarios
```
GET {{BASE_URL}}/api/schedules

✅ Esperado 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "entry_time": "07:30:00",
      "exit_time": "13:00:00",
      "entry_tolerance": 10,
      "exit_tolerance": 20,
      "educational_level_name": "Educación Básica",
      "section_name": "Matutina"
    }
  ]
}
```

## 4.7 Obtener horario por ID
```
GET {{BASE_URL}}/api/schedules/1
✅ Esperado 200: detalle con nombres de nivel y sección
```

## 4.8 Editar horario
```
PUT {{BASE_URL}}/api/schedules/1
Body:
{
  "educational_level_id": 1,
  "section_id": 1,
  "entry_time": "07:00:00",
  "exit_time": "12:30:00",
  "entry_tolerance": 15,
  "exit_tolerance": 20
}
✅ Esperado 200
📝 Luego vuelve a poner 07:30:00 y 13:00:00 para las pruebas de asistencia
```

## 4.9 Eliminar horario sin cursos asociados
```
(Crea un horario extra primero, ej. Nocturna + Básica)
POST /api/schedules → { educational_level_id:1, section_id:3, entry_time:"19:00:00", exit_time:"23:00:00" }
DELETE {{BASE_URL}}/api/schedules/3
✅ Esperado 200: eliminado físicamente
```

---

# 📁 MÓDULO 5 — USUARIOS

## 5.1 Crear profesor
```
Método: POST
URL:    {{BASE_URL}}/api/users
Body:
{
  "first_name": "Carlos",
  "last_name": "Pérez",
  "username": "cperez",
  "cdl": "0101010101",
  "password": "profesor123",
  "email": "cperez@mail.com",
  "phone_number": "0991234567",
  "role": "profesor"
}
✅ Esperado 201: usuario creado con id
```

## 5.2 Crear representante (padre)
```
Body:
{
  "first_name": "María",
  "last_name": "Gómez",
  "username": "mgomez",
  "cdl": "0202020202",
  "password": "padre123",
  "email": "mgomez@mail.com",
  "role": "usuario"
}
✅ Esperado 201
```

## 5.3 Crear segundo admin
```
Body:
{
  "first_name": "Sara",
  "last_name": "López",
  "username": "slopez",
  "cdl": "0303030303",
  "password": "admin456",
  "email": "slopez@mail.com",
  "role": "admin"
}
✅ Esperado 201
```

## 5.4 Rol inválido
```
Body: { ..., "role": "director" }
❌ Esperado 400: { "error": "El rol debe ser: admin, profesor o usuario" }
```

## 5.5 Username duplicado
```
Body: (mismo username "cperez")
❌ Esperado 409: { "error": "El nombre de usuario ya está en uso" }
```

## 5.6 Cédula duplicada
```
Body: (misma cdl "0101010101" con otro username)
❌ Esperado 409: { "error": "La cédula ya está registrada" }
```

## 5.7 Email duplicado
```
Body: (mismo email con otro username y cdl)
❌ Esperado 409: { "error": "El email ya está registrado" }
```

## 5.8 Listar usuarios (como admin)
```
GET {{BASE_URL}}/api/users
✅ Esperado 200: lista de todos los usuarios activos
```

## 5.9 Filtrar por rol
```
GET {{BASE_URL}}/api/users?role=profesor
✅ Esperado 200: solo profesores
```

## 5.10 Listar como profesor (solo se ve a sí mismo)
```
Primero: POST /api/auth/login con { "user": "cperez", "password": "profesor123" }
Luego:   GET  /api/users
✅ Esperado 200: solo los datos de Carlos Pérez (no lista completa)
```

## 5.11 Ver perfil propio
```
(Como admin) GET {{BASE_URL}}/api/users/1
✅ Esperado 200: datos del admin
```

## 5.12 Ver perfil de otro como no-admin
```
(Logueado como profesor, id=2)
GET {{BASE_URL}}/api/users/1
❌ Esperado 403: { "error": "Acceso denegado" }
```

## 5.13 Editar perfil propio (como profesor)
```
(Logueado como cperez)
PUT {{BASE_URL}}/api/users/2
Body:
{
  "first_name": "Carlos",
  "last_name": "Pérez González",
  "username": "cperez",
  "cdl": "0101010101",
  "email": "cperez@mail.com",
  "password": "nuevaPass789"
}
✅ Esperado 200: actualizado
```

## 5.14 Profesor intenta cambiar su rol
```
PUT {{BASE_URL}}/api/users/2
Body: { ..., "role": "admin" }
❌ Esperado 403: { "error": "No tienes permisos para cambiar el rol" }
```

## 5.15 Admin cambia rol de usuario
```
(Logueado como admin)
PUT {{BASE_URL}}/api/users/2
Body: { ..., "role": "admin" }
✅ Esperado 200 (luego revertir a "profesor")
```

## 5.16 Desactivar usuario
```
(Logueado como admin)
DELETE {{BASE_URL}}/api/users/3
✅ Esperado 200: desactivado
```

## 5.17 Admin intenta desactivarse a sí mismo
```
DELETE {{BASE_URL}}/api/users/1 (siendo admin con id=1)
❌ Esperado 400: { "error": "No puedes desactivar tu propia cuenta" }
```

## 5.18 Desactivar usuario ya desactivado
```
DELETE {{BASE_URL}}/api/users/3 (de nuevo)
❌ Esperado 409: { "error": "El usuario ya está desactivado" }
```

> 🔙 Vuelve a loguear como admin antes de continuar.

---

# 📁 MÓDULO 6 — CURSOS

## 6.1 Crear curso con tutor
```
Método: POST
URL:    {{BASE_URL}}/api/courses
Body:
{
  "course_name": "8vo A",
  "educational_level_id": 1,
  "section_id": 1,
  "professor_id": 2
}
✅ Esperado 201: curso creado con id:1
```

## 6.2 Crear curso sin tutor
```
Body:
{
  "course_name": "1ro BGU B",
  "educational_level_id": 2,
  "section_id": 2,
  "professor_id": null
}
✅ Esperado 201: id:2
```

## 6.3 Crear tercer curso
```
Body:
{
  "course_name": "9no B",
  "educational_level_id": 1,
  "section_id": 1
}
✅ Esperado 201: id:3
```

## 6.4 Profesor ya es tutor de otro curso
```
Body: { "course_name": "7mo A", "educational_level_id": 1, "section_id": 1, "professor_id": 2 }
❌ Esperado 409: { "error": "Este profesor ya está asignado como tutor en otro curso" }
```

## 6.5 Nivel educativo inactivo
```
(Desactiva el nivel 1 primero)
Body: { "course_name": "Test", "educational_level_id": 1, "section_id": 1 }
❌ Esperado 404: { "error": "El nivel educativo no existe o está inactivo" }
📝 Reactiva el nivel después
```

## 6.6 Listar cursos
```
GET {{BASE_URL}}/api/courses
✅ Esperado 200: array con nivel, sección y nombre del profesor
```

## 6.7 Detalle del curso
```
GET {{BASE_URL}}/api/courses/1
✅ Esperado 200: detalle completo
```

## 6.8 Editar curso (quitar tutor)
```
PUT {{BASE_URL}}/api/courses/1
Body:
{
  "course_name": "8vo A",
  "educational_level_id": 1,
  "section_id": 1,
  "professor_id": null
}
✅ Esperado 200
📝 Vuelve a asignar professor_id:2 después
```

## 6.9 Listar estudiantes del curso (vacío por ahora)
```
GET {{BASE_URL}}/api/courses/1/students
✅ Esperado 200: { "data": [] }
```

## 6.10 Desactivar curso
```
DELETE {{BASE_URL}}/api/courses/3
✅ Esperado 200: desactivado
```

---

# 📁 MÓDULO 7 — ESTUDIANTES

## 7.1 Crear estudiante sin representante
```
Método: POST
URL:    {{BASE_URL}}/api/students
Body:
{
  "first_name": "Juan",
  "last_name": "Torres",
  "cdl": "0301010101",
  "email": "jtorres@mail.com",
  "phone_number": "0981111111",
  "nfc_uid": "NFC-AA-001",
  "course_id": 1
}
✅ Esperado 201:
{
  "success": true,
  "message": "Estudiante registrado correctamente",
  "data": { "student_id": 1, "parent_id": null }
}
📝 También crea automáticamente student_summaries con 0,0
```

## 7.2 Crear estudiante con representante nuevo
```
Body:
{
  "first_name": "Ana",
  "last_name": "Salinas",
  "cdl": "0302020202",
  "email": "asalinas@mail.com",
  "nfc_uid": "NFC-BB-002",
  "course_id": 1,
  "parent": {
    "first_name": "Roberto",
    "last_name": "Salinas",
    "cdl": "0402020202",
    "email": "rsalinas@mail.com",
    "username": "rsalinas",
    "password": "padre123",
    "phone_number": "0982222222"
  }
}
✅ Esperado 201:
{
  "success": true,
  "message": "Estudiante y representante registrados correctamente",
  "data": { "student_id": 2, "parent_id": 4 }
}
📝 Crea el usuario de rol "usuario" y el relationship automáticamente
```

## 7.3 Crear tercer estudiante con representante YA EXISTENTE
```
Body:
{
  "first_name": "Pedro",
  "last_name": "Salinas",
  "cdl": "0303030303",
  "email": "psalinas@mail.com",
  "nfc_uid": "NFC-CC-003",
  "course_id": 1,
  "parent": {
    "cdl": "0402020202",
    "first_name": "Roberto",
    "last_name": "Salinas",
    "email": "rsalinas@mail.com",
    "username": "rsalinas2",
    "password": "padre123"
  }
}
✅ Esperado 201:
{
  "data": { "student_id": 3, "parent_id": 4 }
}
📝 Misma cédula del padre → no duplica el usuario, solo crea el relationship
```

## 7.4 Crear estudiante del curso 2 (vespertina)
```
Body:
{
  "first_name": "Luis",
  "last_name": "Mora",
  "cdl": "0304040404",
  "email": "lmora@mail.com",
  "nfc_uid": "NFC-DD-004",
  "course_id": 2
}
✅ Esperado 201: student_id: 4
```

## 7.5 NFC UID duplicado
```
Body: { ..., "nfc_uid": "NFC-AA-001", ... }
❌ Esperado 409: { "error": "El NFC UID ya está registrado en otro estudiante" }
```

## 7.6 Cédula duplicada
```
Body: { ..., "cdl": "0301010101", "nfc_uid": "NFC-ZZ-999", ... }
❌ Esperado 409: { "error": "La cédula ya está registrada" }
```

## 7.7 Curso inactivo
```
Body: { ..., "course_id": 3 } (curso desactivado en 6.10)
❌ Esperado 404: { "error": "El curso no existe o está inactivo" }
```

## 7.8 Listar estudiantes
```
GET {{BASE_URL}}/api/students
✅ Esperado 200: lista completa con curso, resumen y representante
```

## 7.9 Detalle del estudiante
```
GET {{BASE_URL}}/api/students/1
✅ Esperado 200: Juan Torres con parent_name: null (no tiene representante)
```

## 7.10 Detalle estudiante 2 (con padre)
```
GET {{BASE_URL}}/api/students/2
✅ Esperado 200: Ana Salinas con parent_name: "Roberto Salinas"
```

## 7.11 Editar estudiante y asignar representante por cédula
```
PUT {{BASE_URL}}/api/students/1
Body:
{
  "first_name": "Juan",
  "last_name": "Torres",
  "cdl": "0301010101",
  "email": "jtorres@mail.com",
  "course_id": 1,
  "parent_cdl": "0202020202"
}
✅ Esperado 200: asigna a María Gómez como representante de Juan
📝 parent_cdl busca en users con role='usuario' y cdl='0202020202'
```

## 7.12 Asignar representante con cédula inexistente
```
PUT {{BASE_URL}}/api/students/1
Body: { ..., "parent_cdl": "9999999999" }
❌ Esperado 404: { "error": "No se encontró un representante activo con la cédula 9999999999" }
```

## 7.13 Desactivar estudiante
```
DELETE {{BASE_URL}}/api/students/4 (Luis Mora del curso 2)
✅ Esperado 200: desactivado
```

## 7.14 Verificar estudiantes del curso 1
```
GET {{BASE_URL}}/api/courses/1/students
✅ Esperado 200: Juan Torres, Ana Salinas, Pedro Salinas (3 estudiantes)
```

---

# 📁 MÓDULO 8 — DÍAS LABORABLES (FERIADOS)

## 8.1 Marcar un día como feriado
```
Método: POST
URL:    {{BASE_URL}}/api/working-days
Body:
{
  "date": "2025-12-25",
  "reason": "Navidad"
}
✅ Esperado 201:
{
  "success": true,
  "message": "Feriado registrado para el 2025-12-25"
}
```

## 8.2 Marcar día de la semana actual como feriado (para probar asistencia)
```
Body:
{
  "date": "2025-05-15",
  "reason": "Feriado de prueba"
}
✅ Esperado 201
📝 Luego prueba entry → debe dar 422 "Hoy no es día laborable"
📝 Borra este feriado después con DELETE /api/working-days/2025-05-15
```

## 8.3 Feriado en fin de semana
```
Body: { "date": "2025-12-27", "reason": "Sábado" } (sábado)
❌ Esperado 400: { "error": "No se puede marcar un fin de semana como feriado" }
```

## 8.4 Feriado sin razón
```
Body: { "date": "2025-12-26" }
❌ Esperado 400: { "error": "El campo reason es requerido" }
```

## 8.5 Editar feriado existente (ON DUPLICATE KEY UPDATE)
```
Body:
{
  "date": "2025-12-25",
  "reason": "Navidad — Día festivo nacional"
}
✅ Esperado 201: actualizado (usa ON DUPLICATE KEY UPDATE)
```

## 8.6 Listar feriados del mes
```
GET {{BASE_URL}}/api/working-days?month=2025-12
✅ Esperado 200: [{ id, date: "2025-12-25", reason: "Navidad..." }]
```

## 8.7 Listar todos los feriados
```
GET {{BASE_URL}}/api/working-days
✅ Esperado 200: todos los registros
```

## 8.8 Detalle de feriado
```
GET {{BASE_URL}}/api/working-days/2025-12-25
✅ Esperado 200: { date, reason }
```

## 8.9 Detalle de fecha sin feriado
```
GET {{BASE_URL}}/api/working-days/2025-01-10
❌ Esperado 404: { "error": "No hay feriado registrado para esa fecha" }
```

## 8.10 Eliminar feriado (restaurar día como laborable)
```
DELETE {{BASE_URL}}/api/working-days/2025-05-15
✅ Esperado 200: { "message": "Feriado del 2025-05-15 eliminado. El día vuelve a ser laborable." }
```

## 8.11 Eliminar feriado inexistente
```
DELETE {{BASE_URL}}/api/working-days/2025-01-10
❌ Esperado 404: { "error": "No hay feriado registrado para esa fecha" }
```

---

# 📁 MÓDULO 9 — HORARIOS ESPECIALES

> ⚠️ Para probar que los horarios especiales afectan la asistencia,
> necesitas que el día actual sea laborable. Usa la Opción B del inicio
> si es fin de semana.

## 9.1 Crear horario especial para TODA la matutina
```
Método: POST
URL:    {{BASE_URL}}/api/special-schedules
Body:
{
  "date": "2025-05-15",
  "section_id": 1,
  "educational_level_id": null,
  "entry_time": "09:00:00",
  "exit_time": "12:00:00",
  "entry_tolerance": 15,
  "exit_tolerance": 20,
  "reason": "Feria de ciencias"
}
✅ Esperado 201: id:1
📝 Aplica a Matutina + todos los niveles (score 2)
```

## 9.2 Crear variación más específica (Matutina + Básica únicamente)
```
Body:
{
  "date": "2025-05-15",
  "section_id": 1,
  "educational_level_id": 1,
  "entry_time": "08:30:00",
  "exit_time": "11:30:00",
  "entry_tolerance": 10,
  "exit_tolerance": 20,
  "reason": "Feria de ciencias — Básica"
}
✅ Esperado 201: id:2
📝 Aplica a Matutina + Básica (score 3 — más específico)
```

## 9.3 Crear variación para Vespertina
```
Body:
{
  "date": "2025-05-15",
  "section_id": 2,
  "educational_level_id": null,
  "entry_time": "14:00:00",
  "exit_time": "17:00:00",
  "reason": "Feria de ciencias — Vespertina"
}
✅ Esperado 201: id:3
```

## 9.4 Crear variación global (todos los niveles y secciones)
```
Body:
{
  "date": "2025-05-16",
  "section_id": null,
  "educational_level_id": null,
  "entry_time": "10:00:00",
  "exit_time": "14:00:00",
  "reason": "Día de recuperación general"
}
✅ Esperado 201: id:4
📝 score 0 — aplica a todos si no hay variación más específica
```

## 9.5 Combinación duplicada
```
Body: (mismo date + section_id + educational_level_id que 9.1)
❌ Esperado 409: { "error": "Ya existe un horario para ese nivel y sección" }
```

## 9.6 Horario especial en día feriado
```
(Primero crea un feriado: POST /api/working-days { date: "2025-06-01", reason: "Test" })
Body:
{
  "date": "2025-06-01",
  "section_id": null,
  "educational_level_id": null,
  "entry_time": "09:00:00",
  "exit_time": "12:00:00",
  "reason": "No debería poder crearse"
}
❌ Esperado 409: { "error": "No puedes crear un horario especial en un día marcado como feriado" }
```

## 9.7 Listar horarios especiales del mes
```
GET {{BASE_URL}}/api/special-schedules?month=2025-05
✅ Esperado 200:
{
  "success": true,
  "data": {
    "2025-05-15": [
      { "id": 1, "section_name": "Matutina", "educational_level_name": "Todos los niveles", "entry_time": "09:00:00", ... },
      { "id": 2, "section_name": "Matutina", "educational_level_name": "Educación Básica", "entry_time": "08:30:00", ... },
      { "id": 3, "section_name": "Vespertina", ... }
    ]
  }
}
```

## 9.8 Listar por día exacto
```
GET {{BASE_URL}}/api/special-schedules?date=2025-05-15
✅ Esperado 200: solo las variaciones de ese día
```

## 9.9 Editar variación específica
```
PUT {{BASE_URL}}/api/special-schedules/1
Body:
{
  "entry_time": "09:30:00",
  "exit_time": "12:30:00",
  "entry_tolerance": 15,
  "exit_tolerance": 25,
  "reason": "Feria de ciencias — horario actualizado"
}
✅ Esperado 200: actualizado
```

## 9.10 Editar variación inexistente
```
PUT {{BASE_URL}}/api/special-schedules/9999
Body: { "entry_time": "09:00:00", "exit_time": "12:00:00", "reason": "Test" }
❌ Esperado 404: { "error": "Horario especial no encontrado" }
```

## 9.11 Eliminar variación específica
```
DELETE {{BASE_URL}}/api/special-schedules/4
✅ Esperado 200: eliminado (solo esa variación, las otras del día permanecen)
```

---

# 📁 MÓDULO 10 — ASISTENCIA: ENTRADA

> 📌 IMPORTANTE: Si es fin de semana, aplica la Opción B del inicio.
> Asegúrate de que NO exista feriado para hoy.
> El horario de Básica Matutina es: entrada 07:30, tolerancia 10 min → puntual hasta 07:40.

## 10.1 Entrada puntual con student_id
```
Método: POST
URL:    {{BASE_URL}}/api/attendance/entry
Body:
{
  "student_id": 1,
  "mock_time": "07:25:00"
}
✅ Esperado 200:
{
  "success": true,
  "message": "Entrada registrada: Puntual",
  "data": {
    "record_id": 1,
    "student": "Juan Torres",
    "entry_time": "07:25:00",
    "status": "Puntual",
    "schedule_type": "base",
    "schedule_reason": null
  }
}
```

## 10.2 Entrada puntual con NFC
```
Body:
{
  "nfc_uid": "NFC-BB-002",
  "mock_time": "07:30:00"
}
✅ Esperado 200: Ana Salinas — Puntual
```

## 10.3 Entrada atrasada
```
Body:
{
  "student_id": 3,
  "mock_time": "07:55:00"
}
✅ Esperado 200:
{
  "message": "Entrada registrada: Atrasado",
  "data": { "status": "Atrasado" }
}
📝 Verificar: daily_course_summaries.total_late debe ser 1
```

## 10.4 Entrada exactamente en el límite de tolerancia (07:40)
```
Body: { "student_id": 1, "mock_time": "07:40:00" }
Pero student 1 ya tiene entrada (prueba 10.1)
❌ Esperado 409 (duplicado)

📝 Resetea y prueba con student sin entrada:
POST /api/dev/reset-attendance
Body: { "student_id": 2, "mock_time": "07:40:00" }
✅ Esperado 200: Puntual (07:40 = 07:30 + 10 min tolerancia, en el límite exacto)
```

## 10.5 Entrada 1 minuto después del límite (07:41)
```
(Después de reset)
Body: { "student_id": 2, "mock_time": "07:41:00" }
✅ Esperado 200: Atrasado (07:41 > 07:30 + 10 min)
```

## 10.6 Entrada duplicada (mismo día)
```
Body: { "student_id": 1, "mock_time": "07:30:00" }
(Juan ya tiene entrada de 10.1)
❌ Esperado 409: { "error": "Ya existe un registro de entrada para hoy" }
```

## 10.7 Fuera de horario (muy temprano — más de 1h antes)
```
(Después de reset)
Body: { "student_id": 2, "mock_time": "05:00:00" }
❌ Esperado 422: { "error": "Fuera del horario permitido para registrar entrada" }
📝 Lógica: current < entry_time - 60min → 05:00 < 06:30 → fuera de horario
```

## 10.8 Sin identificador
```
Body: {}
❌ Esperado 400: { "error": "Se requiere student_id o nfc_uid" }
```

## 10.9 Student ID inexistente
```
Body: { "student_id": 9999, "mock_time": "07:25:00" }
❌ Esperado 404: { "error": "Estudiante no encontrado" }
```

## 10.10 NFC UID inexistente
```
Body: { "nfc_uid": "NFC-FAKE-999", "mock_time": "07:25:00" }
❌ Esperado 404: { "error": "Estudiante no encontrado" }
```

## 10.11 Estudiante inactivo
```
(Luis Mora fue desactivado en 7.13)
Body: { "student_id": 4, "mock_time": "13:40:00" }
❌ Esperado 404: { "error": "Estudiante no encontrado" }
```

## 10.12 Día de feriado
```
(Asegúrate de que hoy sea feriado: POST /api/working-days { date: HOY, reason: "Test" })
Body: { "student_id": 1, "mock_time": "07:25:00" }
❌ Esperado 422: { "error": "Hoy no es un día laborable" }
📝 Borra el feriado después: DELETE /api/working-days/HOY
```

## 10.13 Entrada con horario especial activo
```
(Asegúrate de que exista special_day_schedules para HOY con section_id:1, level:1)
(Crea uno: POST /api/special-schedules { date: HOY, section_id:1, educational_level_id:1, entry_time:"09:00:00", exit_time:"12:00:00", reason:"Prueba" })

Body: { "student_id": 1, "mock_time": "08:55:00" }
✅ Esperado 200:
{
  "data": {
    "status": "Puntual",
    "schedule_type": "special",
    "schedule_reason": "Prueba"
  }
}
📝 observation en BD: "Puntual (horario especial: Prueba)"
```

## 10.14 Entrada atrasada con horario especial
```
Body: { "student_id": 2, "mock_time": "09:20:00" }
(Horario especial: entrada 09:00, tolerancia 15min → atrasado desde 09:15)
✅ Esperado 200: status: "Atrasado" con schedule_type: "special"
```

## 10.15 Verificar student_summaries después de registros
```
SQL directo (o endpoint de detalle estudiante):
SELECT * FROM student_summaries WHERE student_id = 1;
✅ Esperado: total_attendances = 1 (o más según cuántas pruebas hayas hecho)
```

---

# 📁 MÓDULO 11 — ASISTENCIA: SALIDA

> 📌 El horario de Básica Matutina es: salida 13:00, tolerancia 20 min.
> Ventana válida: 12:40 a 13:20.

## 11.1 Salida válida (dentro de ventana)
```
Método: POST
URL:    {{BASE_URL}}/api/attendance/exit
Body:
{
  "student_id": 1,
  "mock_time": "12:50:00"
}
✅ Esperado 200:
{
  "success": true,
  "message": "Salida registrada correctamente",
  "data": {
    "student": "Juan Torres",
    "entry_time": "07:25:00",
    "exit_time": "12:50:00",
    "schedule_type": "base"
  }
}
```

## 11.2 Salida con NFC
```
Body:
{
  "nfc_uid": "NFC-BB-002",
  "mock_time": "13:00:00"
}
✅ Esperado 200: salida de Ana Salinas
```

## 11.3 Salida exactamente al inicio de la ventana (12:40)
```
Body: { "student_id": 3, "mock_time": "12:40:00" }
(Pedro Salinas debe tener entrada primero)
✅ Esperado 200: válida (12:40 = 13:00 - 20 min = límite exacto)
```

## 11.4 Salida 1 minuto antes del inicio de ventana (12:39)
```
(Reset Pedro Salinas, registrar entrada, luego:)
Body: { "student_id": 3, "mock_time": "12:39:00" }
❌ Esperado 422: { "error": "Hora de salida no válida..." }
```

## 11.5 Salida después del cierre de ventana (13:21)
```
Body: { "student_id": 3, "mock_time": "13:21:00" }
❌ Esperado 422: hora fuera de ventana (13:21 > 13:00 + 20 min)
```

## 11.6 Salida duplicada
```
Body: { "student_id": 1, "mock_time": "13:00:00" }
(Juan ya registró salida en 11.1)
❌ Esperado 409: { "error": "La salida ya fue registrada hoy" }
```

## 11.7 Salida sin entrada previa
```
(Registra solo salida sin haber registrado entrada)
Body: { "student_id": 4, "mock_time": "13:00:00" }
(Luis Mora está desactivado — usar otro estudiante sin entrada)
❌ Esperado 404: { "error": "No hay registro de entrada para hoy" }
```

## 11.8 Salida con horario especial
```
(Horario especial de Básica Matutina hoy: exit_time: 12:00:00, tolerance: 20)
Body: { "student_id": 1, "mock_time": "11:50:00" }
✅ Esperado 200: salida válida (11:50 dentro de 11:40-12:20)
     schedule_type: "special"
```

---

# 📁 MÓDULO 12 — CRON DE AUSENCIAS

## 12.1 Ejecutar cron manualmente
```
Método: POST
URL:    {{BASE_URL}}/api/attendance/run-absence-job
Headers:
  x-cron-secret: mi_clave_cron
Body:   {}

✅ Esperado 200: { "success": true, "message": "Job ejecutado correctamente" }
📝 Verificar en BD:
   SELECT * FROM attendance_records WHERE observation = 'Ausente' AND date = CURDATE();
   Los estudiantes sin entrada de hoy deben tener registro de Ausente
```

## 12.2 Cron sin header de autenticación
```
POST {{BASE_URL}}/api/attendance/run-absence-job
(sin el header x-cron-secret)
❌ Esperado 401: { "error": "No autorizado" }
```

## 12.3 Cron con clave incorrecta
```
Headers: x-cron-secret: clave_incorrecta
❌ Esperado 401: { "error": "No autorizado" }
```

## 12.4 Verificar que el cron respeta días no laborables
```
(Marca hoy como feriado, luego ejecuta el cron)
POST /api/working-days { date: HOY, reason: "Test feriado" }
POST /api/attendance/run-absence-job (con header correcto)

✅ Esperado 200: { "message": "Job ejecutado correctamente" }
📝 Pero NO debe crear registros de ausencia (día no laborable)
   SELECT COUNT(*) FROM attendance_records WHERE date = CURDATE() AND observation = 'Ausente';
   → debe ser 0

📝 Borra el feriado: DELETE /api/working-days/HOY
```

---

# 📁 MÓDULO 13 — NOTIFICACIONES

## 13.1 Listar notificaciones del usuario actual
```
GET {{BASE_URL}}/api/notifications
✅ Esperado 200: historial de las últimas 50 notificaciones
   para el usuario logueado
```

## 13.2 Listar notificaciones como padre
```
(Login como mgomez o rsalinas)
GET {{BASE_URL}}/api/notifications
✅ Esperado 200: solo notificaciones de sus hijos
```

## 13.3 Marcar notificación como leída
```
PATCH {{BASE_URL}}/api/notifications/1/read
✅ Esperado 200: { "success": true }
📝 Verificar: notification_recipients.is_read = true para ese id
```

## 13.4 Probar SSE en Postman
```
📝 Postman soporta SSE desde v10.19 en la pestaña "Response" para streams.

Método: GET
URL:    {{BASE_URL}}/api/notifications/stream
(La cookie se envía automáticamente)

✅ Debe ver: data: {"type":"connected","userId":1}

Luego en otra pestaña:
POST /api/attendance/entry { student_id: 1, mock_time: "07:25:00" }
(Después de reset)

✅ En la pestaña SSE debe aparecer:
data: {
  "id": N,
  "type": "entry",
  "variant": "success",
  "name": "Juan Torres",
  "message": "registró su entrada a las 07:25:00",
  "course": "8vo A",
  "createdAt": "..."
}
```

---

# 📁 MÓDULO 14 — RESET Y UTILIDADES

## 14.1 Reset completo de asistencia del día
```
Método: POST
URL:    {{BASE_URL}}/api/dev/reset-attendance
(Solo funciona con NODE_ENV=development)

✅ Esperado 200: { "success": true, "message": "Datos de hoy eliminados" }
📝 Elimina: attendance_records del día, daily_course_summaries del día
   Resetea: student_summaries a 0,0
```

---

# 📋 QUERIES SQL DE VERIFICACIÓN

Usa estas queries directamente en tu BD para verificar resultados:

```sql
-- Registros de asistencia de hoy
SELECT
  s.first_name, s.last_name,
  ar.entry_time, ar.exit_time, ar.observation
FROM attendance_records ar
JOIN students s ON s.id = ar.student_id
WHERE ar.date = CURDATE()
ORDER BY ar.entry_time;

-- Contadores por estudiante
SELECT
  s.first_name, s.last_name,
  ss.total_attendances, ss.total_absences
FROM student_summaries ss
JOIN students s ON s.id = ss.student_id;

-- Resumen del día por curso
SELECT
  c.course_name, sec.name AS section,
  dcs.total_present, dcs.total_absent, dcs.total_late
FROM daily_course_summaries dcs
JOIN courses c  ON c.id  = dcs.course_id
JOIN sections sec ON sec.id = dcs.section_id
WHERE dcs.date = CURDATE();

-- Verificar horario que resolvería para un estudiante hoy
SELECT
  sds.*,
  (CASE WHEN section_id IS NOT NULL THEN 2 ELSE 0 END +
   CASE WHEN educational_level_id IS NOT NULL THEN 1 ELSE 0 END) AS score
FROM special_day_schedules sds
WHERE date = CURDATE()
  AND (section_id = 1 OR section_id IS NULL)
  AND (educational_level_id = 1 OR educational_level_id IS NULL)
ORDER BY score DESC
LIMIT 1;

-- Clientes SSE conectados (en tiempo real — debug)
-- No es consultable en BD, pero puedes hacer:
SELECT * FROM notification_recipients WHERE is_read = FALSE;

-- Notificaciones generadas hoy
SELECT n.type, n.message, n.created_at,
       u.first_name AS recipient, nr.is_read
FROM notifications n
JOIN notification_recipients nr ON nr.notification_id = n.id
JOIN users u ON u.id = nr.user_id
WHERE DATE(n.created_at) = CURDATE()
ORDER BY n.created_at DESC;
```

---

# 📋 RESUMEN DE TODOS LOS ENDPOINTS

| # | Método | Endpoint | Auth | Descripción |
|---|--------|----------|------|-------------|
| 1 | POST | /api/auth/login | - | Login |
| 2 | GET | /api/auth/me | ✓ | Sesión activa |
| 3 | POST | /api/auth/logout | - | Logout |
| 4 | GET | /api/educational-levels | - | Listar niveles |
| 5 | POST | /api/educational-levels | admin | Crear nivel |
| 6 | GET | /api/educational-levels/:id | - | Detalle nivel |
| 7 | PUT | /api/educational-levels/:id | - | Editar nivel |
| 8 | DELETE | /api/educational-levels/:id | - | Desactivar nivel |
| 9 | GET | /api/sections | - | Listar secciones |
| 10 | POST | /api/sections | admin | Crear sección |
| 11 | GET | /api/sections/:id | - | Detalle sección |
| 12 | PUT | /api/sections/:id | - | Editar sección |
| 13 | DELETE | /api/sections/:id | - | Desactivar sección |
| 14 | GET | /api/schedules | - | Listar horarios |
| 15 | POST | /api/schedules | - | Crear horario |
| 16 | GET | /api/schedules/:id | - | Detalle horario |
| 17 | PUT | /api/schedules/:id | - | Editar horario |
| 18 | DELETE | /api/schedules/:id | - | Eliminar horario |
| 19 | GET | /api/working-days | - | Listar feriados |
| 20 | POST | /api/working-days | admin | Crear feriado |
| 21 | GET | /api/working-days/:date | - | Detalle feriado |
| 22 | DELETE | /api/working-days/:date | admin | Eliminar feriado |
| 23 | GET | /api/special-schedules | - | Listar especiales |
| 24 | POST | /api/special-schedules | admin | Crear especial |
| 25 | PUT | /api/special-schedules/:id | admin | Editar especial |
| 26 | DELETE | /api/special-schedules/:id | admin | Eliminar especial |
| 27 | GET | /api/courses | - | Listar cursos |
| 28 | POST | /api/courses | - | Crear curso |
| 29 | GET | /api/courses/:id | - | Detalle curso |
| 30 | PUT | /api/courses/:id | - | Editar curso |
| 31 | DELETE | /api/courses/:id | - | Desactivar curso |
| 32 | GET | /api/courses/:id/students | - | Estudiantes del curso |
| 33 | GET | /api/students | - | Listar estudiantes |
| 34 | POST | /api/students | - | Crear estudiante |
| 35 | GET | /api/students/:id | - | Detalle estudiante |
| 36 | PUT | /api/students/:id | - | Editar estudiante |
| 37 | DELETE | /api/students/:id | - | Desactivar estudiante |
| 38 | GET | /api/users | ✓ | Listar usuarios |
| 39 | POST | /api/users | admin | Crear usuario |
| 40 | GET | /api/users/:id | ✓ | Detalle usuario |
| 41 | PUT | /api/users/:id | ✓ | Editar usuario |
| 42 | DELETE | /api/users/:id | admin | Desactivar usuario |
| 43 | POST | /api/attendance/entry | - | Registrar entrada |
| 44 | POST | /api/attendance/exit | - | Registrar salida |
| 45 | POST | /api/attendance/run-absence-job | cron-secret | Ejecutar cron |
| 46 | GET | /api/notifications | ✓ | Historial notificaciones |
| 47 | GET | /api/notifications/stream | ✓ | SSE stream |
| 48 | PATCH | /api/notifications/:id/read | ✓ | Marcar como leída |
| 49 | POST | /api/dev/reset-attendance | dev only | Reset del día |

**Total: 49 endpoints · 14 módulos · ~80 casos de prueba**