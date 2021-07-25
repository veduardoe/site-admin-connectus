import { trigger, animate, transition, style, query } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
    transition('* => *', [
        query(
            ':enter',
            [style({ opacity: 0, marginTop:'30px' })],
            { optional: true }
        ),
        query(
            ':leave',
            [style({ opacity: 0, marginTop:'0px' }), animate('0.1s', style({ marginTop:'30px'}))],
            { optional: true }
        ),
        query(
          ':enter',
          [style({ opacity: 0, marginTop:'30px' }), animate('0.2s', style({ opacity: 1, marginTop: '0px' }))],
          { optional: true }
      )
    ])
  ]);