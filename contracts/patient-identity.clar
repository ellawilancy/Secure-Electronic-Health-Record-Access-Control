;; patient-identity.clar
;; Manages secure healthcare identifiers for patients

(define-data-var admin principal tx-sender)

;; Map to store patient identities
(define-map patients
  { patient-id: (string-ascii 36) }  ;; UUID format
  {
    owner: principal,
    active: bool,
    created-at: uint,
    last-updated: uint
  }
)

;; Public function to register a new patient
(define-public (register-patient (patient-id (string-ascii 36)))
  (let
    (
      (caller tx-sender)
      (current-time (get-block-info? time (- block-height u1)))
    )
    (asserts! (is-some current-time) (err u1000))
    (asserts! (is-none (map-get? patients { patient-id: patient-id })) (err u1001))

    (map-set patients
      { patient-id: patient-id }
      {
        owner: caller,
        active: true,
        created-at: (unwrap-panic current-time),
        last-updated: (unwrap-panic current-time)
      }
    )
    (ok true)
  )
)

;; Check if a patient ID exists and is active
(define-read-only (is-valid-patient (patient-id (string-ascii 36)))
  (match (map-get? patients { patient-id: patient-id })
    patient-data (ok (get active patient-data))
    (err u1002)
  )
)

;; Allow patient to deactivate their ID
(define-public (deactivate-patient (patient-id (string-ascii 36)))
  (let
    (
      (caller tx-sender)
      (current-time (get-block-info? time (- block-height u1)))
    )
    (asserts! (is-some current-time) (err u1000))

    (match (map-get? patients { patient-id: patient-id })
      patient-data (begin
        (asserts! (is-eq (get owner patient-data) caller) (err u1003))
        (map-set patients
          { patient-id: patient-id }
          (merge patient-data {
            active: false,
            last-updated: (unwrap-panic current-time)
          })
        )
        (ok true)
      )
      (err u1002)
    )
  )
)

;; Allow patient to reactivate their ID
(define-public (reactivate-patient (patient-id (string-ascii 36)))
  (let
    (
      (caller tx-sender)
      (current-time (get-block-info? time (- block-height u1)))
    )
    (asserts! (is-some current-time) (err u1000))

    (match (map-get? patients { patient-id: patient-id })
      patient-data (begin
        (asserts! (is-eq (get owner patient-data) caller) (err u1003))
        (map-set patients
          { patient-id: patient-id }
          (merge patient-data {
            active: true,
            last-updated: (unwrap-panic current-time)
          })
        )
        (ok true)
      )
      (err u1002)
    )
  )
)
