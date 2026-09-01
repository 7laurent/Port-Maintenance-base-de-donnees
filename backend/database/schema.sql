
CREATE DATABASE port_maintenance;


CREATE TABLE equipment (
    equipment_id INT PRIMARY KEY, 
    equipment_code VARCHAR(50) NOT NULL UNIQUE,
    equipment_type VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    commissioning_date DATE,
    current_status VARCHAR(50),
    active INTEGER DEFAULT 1
);

CREATE TABLE technician (
    technician_id INT PRIMARY KEY,
    employee_number VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    specialty VARCHAR(100),
    team VARCHAR(100),
    active INTEGER DEFAULT 1
);


CREATE TABLE spare_part (
    part_id INT PRIMARY KEY,
    part_number VARCHAR(50) NOT NULL UNIQUE,
    part_name VARCHAR(150) NOT NULL,
    unit VARCHAR(30),
    criticality VARCHAR(30),
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE preventive_plan (
    plan_id INT PRIMARY KEY,
    equipment_id INT NOT NULL,
    maintenance_name VARCHAR(150) NOT NULL,
    trigger_type VARCHAR(50),
    interval_value INT,
    interval_unit VARCHAR(30),
    standard_duration_h DECIMAL(6,2),
    next_due_date DATE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        



    CONSTRAINT fk_preventive_plan_equipment
        FOREIGN KEY (equipment_id)
        REFERENCES equipment(equipment_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


CREATE TABLE work_order (
    work_order_id INT PRIMARY KEY,
    work_order_code VARCHAR(50) NOT NULL UNIQUE,
    equipment_id INT NOT NULL,
    maintenance_type VARCHAR (20) NOT NULL,
    plan_id INT NULL,
    priority VARCHAR(30),
    planned_start DATETIME,
    planned_end DATETIME,
    actual_start DATETIME,
    actual_end DATETIME,

    status ENUM(
        'PLANNED',
        'IN_PROGRESS',
        'WAITING_PART',
        'COMPLETED',
        'ON_HOLD',
        'CANCELLED'
    ) DEFAULT 'PLANNED',

    problem_resolved BOOLEAN DEFAULT FALSE,
    rework BOOLEAN DEFAULT FALSE,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

   
    CONSTRAINT fk_work_order_equipment
        FOREIGN KEY (equipment_id)
        REFERENCES equipment(equipment_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_work_order_plan
        FOREIGN KEY (plan_id)
        REFERENCES preventive_plan(plan_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE failure (
    failure_id INT AUTO_INCREMENT PRIMARY KEY,
    work_order_id INT NOT NULL UNIQUE,
    failure_datetime DATETIME,
    failure_description TEXT,
    failure_type VARCHAR(100),
    component VARCHAR(100),
    diagnosis_start DATETIME,
    diagnosis_end DATETIME,
    diagnosis TEXT,
    root_cause TEXT,
    detected_during_preventive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    CONSTRAINT fk_failure_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_order(work_order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE wo_technician (
    work_order_id INT NOT NULL,
    technician_id INT NOT NULL,
    role VARCHAR(100),
    participation_start DATETIME,
    participation_end DATETIME,
    PRIMARY KEY (work_order_id, technician_id),



    CONSTRAINT fk_wo_technician_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_order(work_order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    
    CONSTRAINT fk_wo_technician_technician
        FOREIGN KEY (technician_id)
        REFERENCES technician(technician_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


CREATE TABLE wo_part (
    work_order_part_id INT AUTO_INCREMENT PRIMARY KEY,
    work_order_id INT NOT NULL,
    part_id INT NOT NULL,
    quantity_requested DECIMAL(13,2) DEFAULT 0,
    quantity_received DECIMAL(15,2) DEFAULT 0,
    request_datetime DATETIME,
    available_datetime DATETIME,
    blocked_intervention BOOLEAN DEFAULT FALSE,
    comments TEXT,


    CONSTRAINT fk_wo_part_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_order(work_order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,


    CONSTRAINT fk_wo_part_spare_part
        FOREIGN KEY (part_id)
        REFERENCES spare_part(part_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);



CREATE TABLE equipment_status_history (
    status_history_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME,
    work_order_id INT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_status_history_equipment
        FOREIGN KEY (equipment_id)
        REFERENCES equipment(equipment_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,


    CONSTRAINT fk_status_history_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_order(work_order_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);
