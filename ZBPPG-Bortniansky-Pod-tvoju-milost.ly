\version "2.24.3"
\language "english"
% Profil Gojdič. Prepis podľa dodanej fotografie; 32 taktových úsekov.
% Záverečný úsek je v predlohe bez vnútorných taktových čiar.
% Skrytý meter 19/4 zachováva jeho trvanie bez pridávania taktových čiar.
\header {
 title = "POD TVOJU MILOSŤ"
 subtitle = "(úprava gréckeho nápevu)"
 composer = "D. S. Bortniansky"
 tagline = ##f
}
#(set-global-staff-size 17)
\paper {
 #(set-paper-size "a4")
 top-margin = 5\mm
 bottom-margin = 13\mm
 left-margin = 12\mm
 right-margin = 12\mm
 print-page-number = ##f
 oddFooterMarkup = \markup \fill-line { \fontsize #-1 "Gréckokatolícky chrámový zbor bl. P.P.Gojdiča" }
 evenFooterMarkup = \oddFooterMarkup
 ragged-last-bottom = ##t
 system-system-spacing = #'((basic-distance . 18) (minimum-distance . 14) (padding . 4) (stretchability . 8))
 markup-system-spacing = #'((basic-distance . 7) (minimum-distance . 5) (padding . 2))
}
global = { \key g \major \numericTimeSignature \time 4/4 \autoBeamOff }

SMusic = \absolute { \global
 g'1 | % 1
 fs'2 g'2 | % 2
 a'2( b'4 c''4) | % 3
 b'2 r2 | % 4
 b'2 a'2 | % 5
 g'1 | % 6
 fs'2 r2 | % 7
 g'2 a'2 | % 8
 b'1 | % 9
 a'2 g'2 | % 10
 fs'1 | % 11
 g'2 r2 | % 12
 g'2 g'2 | % 13
 fs'2 g'2 | % 14
 a'2( b'4) b'4 | % 15
 b'2 r2 | % 16
 b'2 b'2 | % 17
 b'1 | % 18
 a'2( g'4) g'4 | % 19
 fs'1( | % 20
 g'2) r2 | % 21
 \tuplet 3/2 { a'2 a'2 a'2 } | % 22
 b'1( | % 23
 a'2) g'2 | % 24
 fs'2. fs'4 | % 25
 g'2 \breathe a'2 | % 26
 b'2. b'4 | % 27
 a'4( c''4) b'4 a'4 | % 28
 g'4 b'4 a'4 g'4 | % 29
 fs'2 fs'2 | % 30
 g'1 | % 31
 \once \omit Staff.TimeSignature \time 19/4 g'4 g'4 g'4 g'4 g'4 a'4 b'2 a'4 a'4 a'4 g'2( fs'2) g'1 | % 32
}

AMusic = \absolute { \global
 e'1 | % 1
 ds'2 e'2 | % 2
 fs'2( g'4 a'4) | % 3
 g'2 r2 | % 4
 g'2 fs'2 | % 5
 e'1 | % 6
 ds'2 r2 | % 7
 e'2 fs'2 | % 8
 g'1 | % 9
 fs'2 e'2 | % 10
 ds'1 | % 11
 e'2 r2 | % 12
 e'2 e'2 | % 13
 ds'2 e'2 | % 14
 fs'2( g'4) g'4 | % 15
 g'2 r2 | % 16
 g'2 g'2 | % 17
 g'1 | % 18
 fs'2( e'4) e'4 | % 19
 ds'1( | % 20
 e'2) r2 | % 21
 \tuplet 3/2 { fs'2 fs'2 fs'2 } | % 22
 g'1( | % 23
 fs'2) e'2 | % 24
 ds'2. ds'4 | % 25
 e'2 fs'2 | % 26
 g'2. g'4 | % 27
 fs'4( a'4) g'4 fs'4 | % 28
 e'4 g'4 fs'4 e'4 | % 29
 ds'2 ds'2 | % 30
 e'1 | % 31
 \once \omit Staff.TimeSignature \time 19/4 e'4 e'4 e'4 e'4 e'4 fs'4 g'2 fs'4 fs'4 fs'4 e'2( ds'2) e'1 | % 32
}

TMusic = \absolute { \global
 b1 | % 1
 b2 b2 | % 2
 d'1 | % 3
 d'2 r2 | % 4
 d'2 d'2 | % 5
 b1 | % 6
 a2 r2 | % 7
 b2 d'2 | % 8
 d'1 | % 9
 d'2 b2 | % 10
 b1 | % 11
 b2 r2 | % 12
 b2 b2 | % 13
 b2 b2 | % 14
 d'2. d'4 | % 15
 d'2 r2 | % 16
 d'2 d'2 | % 17
 d'1 | % 18
 d'2( b4) b4 | % 19
 b1( | % 20
 b2) r2 | % 21
 \tuplet 3/2 { d'2 d'2 d'2 } | % 22
 d'1~ | % 23
 d'2 b2 | % 24
 b2. b4 | % 25
 b2 \breathe d'2 | % 26
 d'2. d'4 | % 27
 d'2 d'4 d'4 | % 28
 b4 b4 b4 b4 | % 29
 b2 b2 | % 30
 b1 | % 31
 \once \omit Staff.TimeSignature \time 19/4 b4 b4 b4 b4 b4 d'4 d'2 d'4 d'4 d'4 b1 b1 | % 32
}

BMusic = \absolute { \global
 e1 | % 1
 b,2 e2 | % 2
 d1 | % 3
 g2 r2 | % 4
 g2 d2 | % 5
 e1 | % 6
 c2 r2 | % 7
 e2 d2 | % 8
 g1 | % 9
 d2 e2 | % 10
 b,1 | % 11
 e2 r2 | % 12
 e2 e2 | % 13
 b,2 e2 | % 14
 d2. d4 | % 15
 g2 r2 | % 16
 g2 g2 | % 17
 g1 | % 18
 d2( e4) e4 | % 19
 b,1( | % 20
 e2) r2 | % 21
 \tuplet 3/2 { d2 d2 d2 } | % 22
 g1( | % 23
 d2) e2 | % 24
 b,2. b,4 | % 25
 e2 d2 | % 26
 g2. g,4 | % 27
 d2 d4 ds4 | % 28
 e4 e4 ds4 e4 | % 29
 b,2 b,2 | % 30
 e1 | % 31
 \once \omit Staff.TimeSignature \time 19/4 e4 e4 e4 e4 e4 d!4 g2 d4 d4 d4 e2( b,2) e1 | % 32
}

BassIIMusic = \absolute { \global
 s1 | % 1
 s1 | % 2
 s1 | % 3
 g,2 s2 | % 4
 g,2 s2 | % 5
 s1 | % 6
 s1 | % 7
 s1 | % 8
 g,1 | % 9
 s1 | % 10
 s1 | % 11
 e,2 s2 | % 12
 s1 | % 13
 s1 | % 14
 s1 | % 15
 g,2 s2 | % 16
 g,2 g,2 | % 17
 g,1 | % 18
 s1 | % 19
 s1 | % 20
 s1 | % 21
 s1 | % 22
 s1 | % 23
 s1 | % 24
 s1 | % 25
 s1 | % 26
 s1 | % 27
 s1 | % 28
 s1 | % 29
 s1 | % 30
 e,1 | % 31
 \once \omit Staff.TimeSignature \time 19/4 s4*19 | % 32
}

textGuideMusic = \absolute { \global
 c'1 | % 1
 c'2 c'2 | % 2
 c'1 | % 3
 c'2 r2 | % 4
 c'2 c'2 | % 5
 c'1 | % 6
 c'2 r2 | % 7
 c'2 c'2 | % 8
 c'1 | % 9
 c'2 c'2 | % 10
 c'1 | % 11
 c'2 r2 | % 12
 c'2 c'2 | % 13
 c'2 c'2 | % 14
 c'2. c'4 | % 15
 c'2 r2 | % 16
 c'2 c'2 | % 17
 c'1 | % 18
 c'2 c'4 c'4 | % 19
 c'1 | % 20
 c'2 r2 | % 21
 \tuplet 3/2 { c'2 c'2 c'2 } | % 22
 c'1 | % 23
 c'2 c'2 | % 24
 c'2. c'4 | % 25
 c'2 c'2 | % 26
 c'2. c'4 | % 27
 c'2 c'4 c'4 | % 28
 c'4 c'4 c'4 c'4 | % 29
 c'2 c'2 | % 30
 c'1 | % 31
 \once \omit Staff.TimeSignature \time 19/4 c'4 c'4 c'4 c'4 c'4 c'4 c'2 c'4 c'4 c'4 c'2 c'2 c'1 | % 32
}

wordsRusyn = \lyricmode {
 Под тво -- ю ми -- лость при -- бі -- га -- єм Бо -- го -- ро --
 ді -- це -- Ді -- во. Мо -- литв на -- ших не -- при -- зри во скор -- біх
 но -- о од бі -- ід і -- зба -- ви на -- ас, і -- зба -- ви нас, Є -- ді -- на
 чи -- ста -- я і Бла -- го -- сло -- вен -- на -- я.
 Пре -- свя -- та -- я Бо -- го -- ро -- ді -- це спа -- си -- і нас.
}

words = \lyricmode {
 Pod tvo -- ju mi -- losť pri -- bi -- ha -- jem Bo -- ho -- ro --
 di -- ce -- Ďi -- vo. Mo -- litv na -- šich ne -- pri -- zri vo skor -- bich
 no -- o od bi -- id i -- zba -- vi na -- as, i -- zba -- vi nas, Je -- di -- na
 či -- sta -- ja i Bla -- ho -- slo -- ven -- na -- ja.
 Pre -- svja -- ta -- ja Bo -- ho -- ro -- di -- ce spa -- si -- i nas.
}
marks = {
 s1^\pp | s1 | s1^\markup \italic "rit." |
 s1 | s1 | s1 | s1 | s1 | s1 \break |
 s1 | s1 | s1 | s1 | s1 | s1^\markup \italic "rit." |
 s1 | s1 | s1 \break |
 s1 | s1 | s1 | s1 | s1 | s1 | s1 | s1 | s1 \break |
 s1 | s1 | s1 | s1 \break |
 s1 s4^\markup \italic "rit." s4*14 \bar "|."
}
\score {
 \new ChoirStaff <<
  \new Staff = "women" <<
   \clef treble
   \new Voice = "S" { \voiceOne \slurUp \SMusic }
   \new Voice = "A" { \voiceTwo \slurDown \AMusic }
   \new NullVoice = "text" { \textGuideMusic }
   \new Voice { \marks }
  >>
  \new Lyrics \with { \override LyricText.font-series = #'bold }
    \lyricsto "text" \wordsRusyn
  \new Lyrics \lyricsto "text" \words
  \new Staff = "men" <<
   \clef bass
   \new Voice = "T" { \voiceOne \slurUp \TMusic }
   \new Voice = "B" { \voiceTwo \slurDown \BMusic }
   \new Voice = "BassII" { \voiceFour \slurDown \BassIIMusic }
  >>
 >>
 \layout {
  indent = 0\mm
  short-indent = 0\mm
  \context { \Lyrics \override LyricText.font-size = #2 \override LyricText.font-series = #'medium }
  \context { \Staff \consists "Merge_rests_engraver" }
 }
}
% Engrave vytvorí MIDI: samostatné stopy SATB a Bas II, Grand Piano.
\score {
 \new StaffGroup <<
  \new Staff \with { instrumentName = "Soprano" midiInstrument = "acoustic grand" } \SMusic
  \new Staff \with { instrumentName = "Alto" midiInstrument = "acoustic grand" } \AMusic
  \new Staff \with { instrumentName = "Tenor" midiInstrument = "acoustic grand" } \TMusic
  \new Staff \with { instrumentName = "Bass I" midiInstrument = "acoustic grand" } \BMusic
  \new Staff \with { instrumentName = "Bass II" midiInstrument = "acoustic grand" } \BassIIMusic
 >>
 \midi { \tempo 4 = 72 }
}
