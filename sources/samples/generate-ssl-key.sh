openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '//CN=a.local.org' \
  -keyout a.local.org-privkey.pem -out a.local.org-cert.pem

openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '//CN=b.local.org' \
  -keyout b.local.org-privkey.pem -out b.local.org-cert.pem
