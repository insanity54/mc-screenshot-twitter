#!/bin/bash

/usr/lib/jvm/java-8-oracle/jre/bin/java \
    -Xmx1024m \
    -Djava.library.path=/home/rabbit/.technic/modpacks/vanilla/bin/natives \
    -Dfml.core.libraries.mirror=http://mirror.technicpack.net/Technic/lib/fml/%s \
    -Dminecraft.applet.TargetDirectory=/home/rabbit/.technic/modpacks/vanilla \
    -Djava.net.preferIPv4Stack=true \
    -cp /home/rabbit/.technic/modpacks/vanilla/bin/modpack.jar:/home/rabbit/.technic/cache/oshi-project/oshi-core/1.1/oshi-core-1.1.jar:/home/rabbit/.technic/cache/net/java/dev/jna/jna/3.4.0/jna-3.4.0.jar:/home/rabbit/.technic/cache/net/java/dev/jna/platform/3.4.0/platform-3.4.0.jar:/home/rabbit/.technic/cache/com/ibm/icu/icu4j-core-mojang/51.2/icu4j-core-mojang-51.2.jar:/home/rabbit/.technic/cache/net/sf/jopt-simple/jopt-simple/4.6/jopt-simple-4.6.jar:/home/rabbit/.technic/cache/com/paulscode/codecjorbis/20101023/codecjorbis-20101023.jar:/home/rabbit/.technic/cache/com/paulscode/codecwav/20101023/codecwav-20101023.jar:/home/rabbit/.technic/cache/com/paulscode/libraryjavasound/20101123/libraryjavasound-20101123.jar:/home/rabbit/.technic/cache/com/paulscode/librarylwjglopenal/20100824/librarylwjglopenal-20100824.jar:/home/rabbit/.technic/cache/com/paulscode/soundsystem/20120107/soundsystem-20120107.jar:/home/rabbit/.technic/cache/io/netty/netty-all/4.0.23.Final/netty-all-4.0.23.Final.jar:/home/rabbit/.technic/cache/com/google/guava/guava/17.0/guava-17.0.jar:/home/rabbit/.technic/cache/org/apache/commons/commons-lang3/3.3.2/commons-lang3-3.3.2.jar:/home/rabbit/.technic/cache/commons-io/commons-io/2.4/commons-io-2.4.jar:/home/rabbit/.technic/cache/commons-codec/commons-codec/1.9/commons-codec-1.9.jar:/home/rabbit/.technic/cache/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar:/home/rabbit/.technic/cache/net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar:/home/rabbit/.technic/cache/com/google/code/gson/gson/2.2.4/gson-2.2.4.jar:/home/rabbit/.technic/cache/com/mojang/authlib/1.5.21/authlib-1.5.21.jar:/home/rabbit/.technic/cache/com/mojang/realms/1.7.22/realms-1.7.22.jar:/home/rabbit/.technic/cache/org/apache/commons/commons-compress/1.8.1/commons-compress-1.8.1.jar:/home/rabbit/.technic/cache/org/apache/httpcomponents/httpclient/4.3.3/httpclient-4.3.3.jar:/home/rabbit/.technic/cache/commons-logging/commons-logging/1.1.3/commons-logging-1.1.3.jar:/home/rabbit/.technic/cache/org/apache/httpcomponents/httpcore/4.3.2/httpcore-4.3.2.jar:/home/rabbit/.technic/cache/org/apache/logging/log4j/log4j-api/2.0-beta9/log4j-api-2.0-beta9.jar:/home/rabbit/.technic/cache/org/apache/logging/log4j/log4j-core/2.0-beta9/log4j-core-2.0-beta9.jar:/home/rabbit/.technic/cache/org/lwjgl/lwjgl/lwjgl/2.9.4-nightly-20150209/lwjgl-2.9.4-nightly-20150209.jar:/home/rabbit/.technic/cache/org/lwjgl/lwjgl/lwjgl_util/2.9.4-nightly-20150209/lwjgl_util-2.9.4-nightly-20150209.jar:/home/rabbit/.technic/cache/tv/twitch/twitch/6.5/twitch-6.5.jar:/home/rabbit/.technic/modpacks/vanilla/bin/minecraft.jar \
    net.minecraft.client.main.Main \
    --username insanity54 \
    --version 1.8.7 \
    --gameDir /home/rabbit/.technic/modpacks/vanilla \
    --assetsDir /home/rabbit/.technic/assets \
    --assetIndex 1.8 \
    --uuid e642f297bd15491bb68d8370fec95bcf \
    --accessToken 0c2496042ae746ebb573bbcb65cdce50 \
    --userProperties {} \
    --userType legacy \
    --title Vanilla \
    --icon /home/rabbit/.technic/assets/packs/vanilla/icon.png
