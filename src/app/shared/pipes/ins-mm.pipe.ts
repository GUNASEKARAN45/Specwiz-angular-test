/**
 * Pipe for formatting inches to a dual-unit string.
 * SPEC.md §5, AC-GEOM-02 — "X.XXX ins / XX.XX mm"
 */
import { Pipe, PipeTransform } from '@angular/core';
import { formatInches, formatMm, inchesToMm } from '../../core/util/units.util';

@Pipe({
  name: 'insMm',
  standalone: true,
  pure: true,
})
export class InsMMPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return `${formatInches(value)} / ${formatMm(value != null ? inchesToMm(value) : undefined)}`;
  }
}
