;; provider-verification.clar
;; Validates legitimate healthcare entities

(define-data-var admin principal tx-sender)

;; Provider types
(define-constant PROVIDER_TYPE_HOSPITAL u1)
(define-constant PROVIDER_TYPE_CLINIC u2)
(define-constant PROVIDER_TYPE_DOCTOR u3)
(define-constant PROVIDER_TYPE_NURSE u4)
(define-constant PROVIDER_TYPE_LAB u5)

;; Map to store verified providers
(define-map providers
  { provider-id: (string-ascii 36) }  ;; UUID format
  {
    principal: principal,
    name: (string-utf8 100),
    provider-type: uint,
    license-id: (string-ascii 50),
    verified: bool,
    active: bool,
    created-at: uint,
    last-updated: uint
  }
)

;; Register a new provider (only admin can do this)
(define-public (register-provider
    (provider-id (string-ascii 36))
    (provider-principal principal)
    (name (string-utf8 100))
    (provider-type uint)
    (license-id (string-ascii 50)))
  (let
    (
      (caller tx-sender)
      (current-time (get-block-info? time (- block-height u1)))
    )
    (asserts! (is-some current-time) (err u1000))
    (asserts! (is-eq caller (var-get admin)) (err u1001))
    (asserts! (is-none (map-get? providers { provider-id: provider-id })) (err u1002))

    (map-set providers
      { provider-id: provider-id }
      {
        principal: provider-principal,
        name: name,
        provider-type: provider-type,
        license-id: license-id,
        verified: false,
        active: true,
        created-at: (unwrap-panic current-time),
        last-updated: (unwrap-panic current-time)
      }
    )
    (ok true)
  )
)

;; Verify a provider (only admin can do this)
(define-public (verify-provider (provider-id (string-ascii 36)))
  (let
    (
      (caller tx-sender)
      (current-time (get-block-info? time (- block-height u1)))
    )
    (asserts! (is-some current-time) (err u1000))
    (asserts! (is-eq caller (var-get admin)) (err u1001))

    (match (map-get? providers { provider-id: provider-id })
      provider-data (begin
        (map-set providers
          { provider-id: provider-id }
          (merge provider-data {
            verified: true,
            last-updated: (unwrap-panic current-time)
          })
        )
        (ok true)
      )
      (err u1003)
    )
  )
)

;; Check if a provider is verified and active
(define-read-only (is-verified-provider (provider-id (string-ascii 36)))
  (match (map-get? providers { provider-id: provider-id })
    provider-data (and (get verified provider-data) (get active provider-data))
    false
  )
)

;; Deactivate a provider (only admin can do this)
(define-public (deactivate-provider (provider-id (string-ascii 36)))
  (let
    (
      (caller tx-sender)
      (current-time (get-block-info? time (- block-height u1)))
    )
    (asserts! (is-some current-time) (err u1000))
    (asserts! (is-eq caller (var-get admin)) (err u1001))

    (match (map-get? providers { provider-id: provider-id })
      provider-data (begin
        (map-set providers
          { provider-id: provider-id }
          (merge provider-data {
            active: false,
            last-updated: (unwrap-panic current-time)
          })
        )
        (ok true)
      )
      (err u1003)
    )
  )
)

;; Get provider details
(define-read-only (get-provider-details (provider-id (string-ascii 36)))
  (map-get? providers { provider-id: provider-id })
)
