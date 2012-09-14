keytool -genkey -alias postcard.ledui.keystore  -keyalg RSA -validity 20000 -keystore postcard.ledui.keystore
jarsigner -verbose -keystore postcard.ledui.keystore -signedjar ledui_signed.apk ledui.apk postcard.ledui.keystore
