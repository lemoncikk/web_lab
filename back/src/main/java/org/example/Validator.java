package org.example;

import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

public class Validator {
    public record Params(double x, double y, double r) {}

    private static final Pattern NUMBER = Pattern.compile("-?\\d{1,10}(\\.\\d{1,10})?");
    private static final Set<Double> R_VALUES = Set.of(1.0, 1.5, 2.0, 2.5, 3.0);

    private static double number(Map<String, String> map, String key) {
        var raw = map.get(key);
        if (raw == null) throw new ApiException("Parameter %s is missing".formatted(key), 400);
        if (!NUMBER.matcher(raw).matches()) throw new ApiException("Parameter %s must be a decimal number", 400);
        return Double.parseDouble(raw);
    }

    public static Params parse(Map<String, String> map) {
        var x = number(map, "x-cord");
        var y = number(map, "y-cord");
        var r = number(map, "r-group");
        if (x < -5 || x > 3 || x != Math.rint(x)) throw new ApiException("X must be an integer in [-5; 3]", 400);
        if (y < -3 || y > 3) throw new ApiException("Y must be an number in [-3; 3]", 400);
        if (!R_VALUES.contains(r)) throw new ApiException("R must be one of the %s values".formatted(R_VALUES), 400);

        return new Params(x, y, r);
    }
}
